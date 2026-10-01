import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Role,
  User,
  Assignment,
  Submission,
  Course,
  AuditLogItem,
  ReconciliationRecord,
  RubricCriterion,
} from '../types';
import {
  USERS,
  COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  AUDIT_LOGS,
  INITIAL_RECONCILIATION_ROWS,
  DEMO_ASSIGNMENT_DEADLINE,
} from '../data/mockData';
import {
  evaluateSubmissionStatus,
  computeFinalMarks,
  validateAwardedMarks,
  validateUploadFile,
  computeTurnaroundDays,
} from '../lib/submissionRules';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type SimulatedTimePreset =
  | 'real'
  | 'D_minus_1s'
  | 'D_exact'
  | 'D_plus_1s'
  | 'D_plus_24h'
  | 'D_plus_24h_1s'
  | 'D_plus_48h'
  | 'D_plus_48h_1s'
  | 'extension_granted';

interface AppContextType {
  role: Role;
  user: User;
  setRole: (role: Role) => void;
  serverTime: Date;
  activePreset: SimulatedTimePreset;
  setSimulatedPreset: (preset: SimulatedTimePreset) => void;
  resetSimulatedTime: () => void;
  
  // Demo surge load state
  deadlineSurgeActive: boolean;
  toggleDeadlineSurge: () => void;
  surgeMetrics: {
    activeUsers: number;
    rps: number;
    p95LatencyMs: number;
    errorRate: number;
    cpuLoad: number;
  };

  // Domain data
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
  auditLogs: AuditLogItem[];
  reconciliationRows: ReconciliationRecord[];
  injectedMismatch: boolean;
  toggleInjectedMismatch: () => void;
  scaleUpApproved: boolean;
  approveScaleUp: () => void;

  // Actions
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  toasts: ToastMessage[];

  // Student Actions
  submitStudentFile: (
    assignmentId: string,
    file: { name: string; size: number; type: string }
  ) => { success: boolean; error?: string; receipt?: string };

  // Faculty Actions
  createAssignment: (assignment: Omit<Assignment, 'id' | 'status' | 'feedbackReleased'>) => boolean;
  saveRubric: (assignmentId: string, rubric: RubricCriterion[]) => boolean;
  saveGrade: (
    submissionId: string,
    awardedMarks: number,
    rubricScores: Record<string, number>,
    comments: string,
    isFinal: boolean,
    changeReason?: string
  ) => { success: boolean; error?: string };
  bulkReleaseFeedback: (assignmentId: string) => void;
  grantExtension: (
    submissionId: string,
    extendedDeadline: string,
    reason: string
  ) => void;

  // Assessment Cell Actions
  exportMarks: (courseCode: string, assignmentId: string) => void;
  exportLogs: Array<{ id: string; time: string; user: string; courseCode: string; assignment: string; rowCount: number; isRepeat: boolean }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('student');
  const [activePreset, setActivePreset] = useState<SimulatedTimePreset>('D_minus_1s'); // Default convenient demo preset
  const [deadlineSurgeActive, setDeadlineSurgeActive] = useState<boolean>(false);
  const [injectedMismatch, setInjectedMismatch] = useState<boolean>(false);
  const [scaleUpApproved, setScaleUpApproved] = useState<boolean>(false);

  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(AUDIT_LOGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [exportLogs, setExportLogs] = useState<Array<{ id: string; time: string; user: string; courseCode: string; assignment: string; rowCount: number; isRepeat: boolean }>>([
    {
      id: 'exp_01',
      time: '2026-10-14T09:12:00.000Z',
      user: 'Mr. Pradeep Sen (Assessment Cell)',
      courseCode: 'CS303',
      assignment: 'Assignment 2: SRS Document',
      rowCount: 78,
      isRepeat: false,
    },
  ]);

  // Compute effective server time based on preset vs real clock
  const getPresetDate = (preset: SimulatedTimePreset): Date => {
    const D = new Date(DEMO_ASSIGNMENT_DEADLINE).getTime();
    switch (preset) {
      case 'D_minus_1s':
        return new Date(D - 1000); // 1 sec before deadline
      case 'D_exact':
        return new Date(D); // exactly deadline
      case 'D_plus_1s':
        return new Date(D + 1000); // 1 sec after deadline (Late Band 1)
      case 'D_plus_24h':
        return new Date(D + 24 * 60 * 60 * 1000); // exactly 24h after (Late Band 1 boundary)
      case 'D_plus_24h_1s':
        return new Date(D + 24 * 60 * 60 * 1000 + 1000); // 24h 1s after (Late Band 2)
      case 'D_plus_48h':
        return new Date(D + 48 * 60 * 60 * 1000); // exactly 48h after (Late Band 2 boundary)
      case 'D_plus_48h_1s':
        return new Date(D + 48 * 60 * 60 * 1000 + 1000); // 48h 1s after (Closed)
      case 'extension_granted':
        return new Date(D + 48 * 60 * 60 * 1000 + 1000); // 48h 1s after, but extension granted
      case 'real':
      default:
        return new Date();
    }
  };

  const [serverTime, setServerTime] = useState<Date>(() => getPresetDate(activePreset));

  // Ticking server clock
  useEffect(() => {
    const timer = setInterval(() => {
      setServerTime((prev) => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const setSimulatedPreset = (preset: SimulatedTimePreset) => {
    setActivePreset(preset);
    const newTime = getPresetDate(preset);
    setServerTime(newTime);

    if (preset === 'extension_granted') {
      // Automatically grant extension to student Aarav Sharma for demo assignment
      setSubmissions((prev) =>
        prev.map((s) => {
          if (s.studentRoll === '2024BCS0042' && s.assignmentId === 'asg_se_01') {
            return {
              ...s,
              extensionGranted: true,
              extendedDeadline: new Date(new Date(DEMO_ASSIGNMENT_DEADLINE).getTime() + 72 * 3600 * 1000).toISOString(),
              extensionReason: 'Dean Approved Academic Extension (DEMO-EXT-2026)',
            };
          }
          return s;
        })
      );
      addToast('Extension Applied', 'Demo student granted +72h extension with penalty waived.', 'info');
    }
  };

  const resetSimulatedTime = () => {
    setSimulatedPreset('real');
    addToast('Server Time Reset', 'Switched to actual live time.', 'info');
  };

  const toggleDeadlineSurge = () => {
    setDeadlineSurgeActive((prev) => {
      const next = !prev;
      if (next) {
        addToast(
          'Load Surge Active',
          'Simulating 480 concurrent users submitting during deadline hour. Rate limit & caching engaged.',
          'warning'
        );
      } else {
        addToast('Normal Load', 'Traffic normalized back to baseline.', 'info');
      }
      return next;
    });
  };

  // Dynamic surge metrics for the live meter
  const [surgeMetrics, setSurgeMetrics] = useState({
    activeUsers: 48,
    rps: 12,
    p95LatencyMs: 380,
    errorRate: 0.02,
    cpuLoad: 24,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (deadlineSurgeActive) {
        setSurgeMetrics({
          activeUsers: Math.floor(460 + Math.random() * 20),
          rps: Math.floor(140 + Math.random() * 30),
          p95LatencyMs: Math.floor(1800 + Math.random() * 800), // well under 3000ms SLA target
          errorRate: +(0.15 + Math.random() * 0.35).toFixed(2), // well under 1.0%
          cpuLoad: Math.floor(72 + Math.random() * 12),
        });
      } else {
        setSurgeMetrics({
          activeUsers: Math.floor(40 + Math.random() * 15),
          rps: Math.floor(8 + Math.random() * 6),
          p95LatencyMs: Math.floor(280 + Math.random() * 120),
          errorRate: 0.01,
          cpuLoad: Math.floor(22 + Math.random() * 8),
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [deadlineSurgeActive]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    addToast('Role Switched', `Logged in as ${USERS[newRole].name} (${USERS[newRole].department})`, 'info');
  };

  const toggleInjectedMismatch = () => {
    setInjectedMismatch((prev) => {
      const next = !prev;
      addToast(
        next ? 'Mismatch Injected' : 'Mismatch Resolved',
        next
          ? 'Injected 1 grade difference into ERP ledger for demo testing.'
          : 'Reconciliation table synchronized: 0 mismatches.',
        next ? 'warning' : 'success'
      );
      return next;
    });
  };

  const approveScaleUp = () => {
    setScaleUpApproved(true);
    addToast(
      'Scale-Up Authorized',
      'Dean Prof. K. R. Ramaswamy officially approved full campus rollout across all School of Computing departments!',
      'success'
    );
    setAuditLogs((prev) => [
      {
        id: 'log_' + Date.now(),
        timestamp: serverTime.toISOString(),
        user: USERS.dean.name,
        role: 'dean',
        action: 'APPROVE_SCALE_UP',
        entity: 'School of Computing Portal',
        details: 'Pilot criteria verified 6/6 green. Approved scale-up to 2,400 students across all undergraduate branches.',
        status: 'SUCCESS',
      },
      ...prev,
    ]);
  };

  // Student submit action
  const submitStudentFile = (
    assignmentId: string,
    file: { name: string; size: number; type: string }
  ) => {
    const fileValidation = validateUploadFile(file);
    if (!fileValidation.valid) {
      addToast('Upload Rejected', fileValidation.error || 'Invalid file', 'error');
      return { success: false, error: fileValidation.error };
    }

    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) {
      return { success: false, error: 'Assignment not found' };
    }

    const existingSub = submissions.find(
      (s) => s.studentRoll === '2024BCS0042' && s.assignmentId === assignmentId
    );

    const evalResult = evaluateSubmissionStatus(
      serverTime,
      assignment.deadline,
      existingSub?.extensionGranted || activePreset === 'extension_granted',
      existingSub?.extendedDeadline
    );

    if (!evalResult.uploadAllowed) {
      const errorMsg = 'Portal is strictly closed. More than 48 hours have elapsed past the deadline.';
      addToast('Submission Blocked', errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    const currentVersionCount = existingSub ? existingSub.versions.length : 0;
    if (currentVersionCount >= 5) {
      const errorMsg = 'Maximum version limit (5) reached. Contact course coordinator if replacement required.';
      addToast('Limit Exceeded', errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    const nextVer = currentVersionCount + 1;
    const receiptNumber = `ASN-2026-${assignment.courseCode}-${Math.floor(1000 + Math.random() * 9000)}-V${nextVer}`;

    const newVersion = {
      versionNumber: nextVer,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/pdf',
      submittedAt: serverTime.toISOString(),
      receiptNumber,
      status: evalResult.status,
      penaltyPercent: evalResult.penaltyPercent,
    };

    setSubmissions((prev) => {
      const idx = prev.findIndex(
        (s) => s.studentRoll === '2024BCS0042' && s.assignmentId === assignmentId
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          status: evalResult.status,
          activeVersion: nextVer,
          penaltyPercent: evalResult.penaltyPercent,
          versions: [...updated[idx].versions, newVersion],
        };
        return updated;
      } else {
        const newSub: Submission = {
          id: 'sub_' + Date.now(),
          assignmentId,
          studentId: USERS.student.id,
          studentName: USERS.student.name,
          studentRoll: '2024BCS0042',
          courseCode: assignment.courseCode,
          status: evalResult.status,
          activeVersion: nextVer,
          versions: [newVersion],
          extensionGranted: false,
          gradingStatus: 'UNGRADED',
          penaltyPercent: evalResult.penaltyPercent,
        };
        return [...prev, newSub];
      }
    });

    // Add Audit Log
    setAuditLogs((prev) => [
      {
        id: 'log_' + Date.now(),
        timestamp: serverTime.toISOString(),
        user: `${USERS.student.name} (2024BCS0042)`,
        role: 'student',
        action: 'SUBMIT_FILE',
        entity: `${assignment.courseCode} - ${assignment.title} (v${nextVer})`,
        details: `File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB). Status: ${evalResult.label}. Receipt: ${receiptNumber}.`,
        status: 'SUCCESS',
      },
      ...prev,
    ]);

    addToast(
      'Submission Received',
      `Receipt #${receiptNumber} generated. Confirmation sent to ${USERS.student.email}.`,
      'success'
    );

    return { success: true, receipt: receiptNumber };
  };

  // Faculty Create Assignment
  const createAssignment = (data: Omit<Assignment, 'id' | 'status' | 'feedbackReleased'>) => {
    const id = 'asg_' + Math.random().toString(36).substring(2, 9);
    const newAssignment: Assignment = {
      ...data,
      id,
      status: 'published',
      feedbackReleased: false,
    };
    setAssignments((prev) => [newAssignment, ...prev]);

    setAuditLogs((prev) => [
      {
        id: 'log_' + Date.now(),
        timestamp: serverTime.toISOString(),
        user: USERS.faculty.name,
        role: 'faculty',
        action: 'CREATE_ASSIGNMENT',
        entity: `${data.courseCode} - ${data.title}`,
        details: `Created new assignment. Max Marks: ${data.maxMarks}. Deadline: ${data.deadline}.`,
        status: 'SUCCESS',
      },
      ...prev,
    ]);

    addToast('Assignment Published', `"${data.title}" is now visible to enrolled students.`, 'success');
    return true;
  };

  // Faculty Save Rubric
  const saveRubric = (assignmentId: string, rubric: RubricCriterion[]) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, rubric } : a))
    );
    addToast('Rubric Updated', 'Grading criteria and weight distribution saved.', 'success');
    return true;
  };

  // Faculty Save / Finalise Grade
  const saveGrade = (
    submissionId: string,
    awardedMarks: number,
    rubricScores: Record<string, number>,
    comments: string,
    isFinal: boolean,
    changeReason?: string
  ) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return { success: false, error: 'Submission not found' };

    const assignment = assignments.find((a) => a.id === sub.assignmentId);
    const maxMarks = assignment?.maxMarks || 50;

    const validation = validateAwardedMarks(awardedMarks, maxMarks);
    if (!validation.valid) {
      addToast('Mark Validation Failed', validation.error || 'Invalid marks', 'error');
      return { success: false, error: validation.error };
    }

    if (sub.gradingStatus === 'FINALISED' && isFinal && !changeReason && sub.awardedMarks !== awardedMarks) {
      const err = 'Changing an already finalized grade requires an audit justification note.';
      addToast('Reason Required', err, 'error');
      return { success: false, error: err };
    }

    const finalMarks = computeFinalMarks(awardedMarks, sub.penaltyPercent);

    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          return {
            ...s,
            gradingStatus: isFinal ? 'FINALISED' : 'DRAFT',
            awardedMarks,
            finalMarks,
            rubricScores,
            facultyComments: comments,
            gradedBy: USERS.faculty.name,
            gradedAt: serverTime.toISOString(),
            gradeChangeReason: changeReason || s.gradeChangeReason,
          };
        }
        return s;
      })
    );

    setAuditLogs((prev) => [
      {
        id: 'log_' + Date.now(),
        timestamp: serverTime.toISOString(),
        user: USERS.faculty.name,
        role: 'faculty',
        action: isFinal ? 'FINALISE_GRADE' : 'SAVE_DRAFT_GRADE',
        entity: `${sub.studentName} (${sub.studentRoll})`,
        details: `Awarded: ${awardedMarks}/${maxMarks}, Penalty: ${sub.penaltyPercent}%, Final: ${finalMarks}. ${changeReason ? 'Reason: ' + changeReason : ''}`,
        status: 'SUCCESS',
      },
      ...prev,
    ]);

    addToast(
      isFinal ? 'Grade Finalised' : 'Draft Saved',
      `${sub.studentName}: Awarded ${awardedMarks} (Net: ${finalMarks})`,
      'success'
    );

    return { success: true };
  };

  // Faculty Bulk Release Feedback
  const bulkReleaseFeedback = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    const turnaround = computeTurnaroundDays(assignment.deadline, serverTime);

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              feedbackReleased: true,
              feedbackReleasedAt: serverTime.toISOString(),
            }
          : a
      )
    );

    setAuditLogs((prev) => [
      {
        id: 'log_' + Date.now(),
        timestamp: serverTime.toISOString(),
        user: USERS.faculty.name,
        role: 'faculty',
        action: 'RELEASE_FEEDBACK',
        entity: `${assignment.courseCode} - ${assignment.title}`,
        details: `Published feedback to all students. Computed turnaround: ${turnaround} days (Target: < 7.0 days).`,
        status: 'SUCCESS',
      },
      ...prev,
    ]);

    addToast(
      'Feedback Released',
      `Grades and rubric breakdown are now visible to students. Computed Turnaround: ${turnaround} days.`,
      'success'
    );
  };

  // Faculty Grant Extension
  const grantExtension = (submissionId: string, extendedDeadline: string, reason: string) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          return {
            ...s,
            extensionGranted: true,
            extendedDeadline,
            extensionReason: reason,
          };
        }
        return s;
      })
    );

    const sub = submissions.find((s) => s.id === submissionId);

    setAuditLogs((prev) => [
      {
        id: 'log_' + Date.now(),
        timestamp: serverTime.toISOString(),
        user: USERS.faculty.name,
        role: 'faculty',
        action: 'GRANT_EXTENSION',
        entity: sub ? `${sub.studentName} (${sub.studentRoll})` : 'Student',
        details: `Extended deadline to ${extendedDeadline}. Reason: ${reason}`,
        status: 'SUCCESS',
      },
      ...prev,
    ]);

    addToast('Extension Granted', `Extended deadline updated for student. Penalty recalculation active.`, 'success');
  };

  // Assessment Cell Export
  const exportMarks = (courseCode: string, assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    const courseSubmissions = submissions.filter((s) => s.assignmentId === assignmentId);
    const count = courseSubmissions.length || 78;

    const isRepeat = exportLogs.some((l) => l.courseCode === courseCode && l.assignment === assignment?.title);

    const newLog = {
      id: 'exp_' + Date.now(),
      time: serverTime.toISOString(),
      user: `${USERS.assessment_cell.name} (Assessment Cell)`,
      courseCode,
      assignment: assignment?.title || 'Assignment Marks',
      rowCount: count,
      isRepeat,
    };

    setExportLogs((prev) => [newLog, ...prev]);

    setAuditLogs((prev) => [
      {
        id: 'log_' + Date.now(),
        timestamp: serverTime.toISOString(),
        user: USERS.assessment_cell.name,
        role: 'assessment_cell',
        action: 'EXPORT_MARKS',
        entity: `${courseCode} - ${assignment?.title}`,
        details: `Generated CSV export for ${count} students. Revised/Repeat Flag: ${isRepeat ? 'YES' : 'NO'}.`,
        status: 'SUCCESS',
      },
      ...prev,
    ]);

    addToast(
      'Marks Export Complete',
      `Exported assessment sheet (${count} records). Revised flag: ${isRepeat ? 'True' : 'False'}.`,
      'success'
    );
  };

  // Reconciliation rows with dynamic mismatch toggle
  const currentReconciliationRows = INITIAL_RECONCILIATION_ROWS.map((row) => {
    if (injectedMismatch && row.studentRoll === '2024BCS0089') {
      return {
        ...row,
        erpMarks: 35.0, // Portal has 38.0, creates 3.0 point discrepancy
        status: 'MISMATCH' as const,
      };
    }
    return row;
  });

  return (
    <AppContext.Provider
      value={{
        role,
        user: USERS[role],
        setRole,
        serverTime,
        activePreset,
        setSimulatedPreset,
        resetSimulatedTime,
        deadlineSurgeActive,
        toggleDeadlineSurge,
        surgeMetrics,
        courses: COURSES,
        assignments,
        submissions,
        auditLogs,
        reconciliationRows: currentReconciliationRows,
        injectedMismatch,
        toggleInjectedMismatch,
        scaleUpApproved,
        approveScaleUp,
        addToast,
        removeToast,
        toasts,
        submitStudentFile,
        createAssignment,
        saveRubric,
        saveGrade,
        bulkReleaseFeedback,
        grantExtension,
        exportMarks,
        exportLogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
