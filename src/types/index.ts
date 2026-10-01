export type Role = 'student' | 'faculty' | 'dean' | 'assessment_cell' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  rollNumber?: string;
  department: string;
  avatar?: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  description: string;
  maxMarks: number;
}

export type SubmissionStatus = 'ON_TIME' | 'LATE_BAND_1' | 'LATE_BAND_2' | 'CLOSED';

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  instructions: string;
  maxMarks: number;
  publishedAt: string; // ISO date string in IST
  deadline: string; // ISO date string in IST
  rubric: RubricCriterion[];
  status: 'published' | 'draft' | 'closed';
  feedbackReleased: boolean;
  feedbackReleasedAt?: string;
  attachmentName?: string;
}

export interface SubmissionVersion {
  versionNumber: number;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  submittedAt: string;
  receiptNumber: string;
  status: SubmissionStatus;
  penaltyPercent: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  courseCode: string;
  status: SubmissionStatus | 'NOT_SUBMITTED';
  activeVersion: number;
  versions: SubmissionVersion[];
  extensionGranted: boolean;
  extendedDeadline?: string;
  extensionReason?: string;
  
  // Grading fields
  gradingStatus: 'UNGRADED' | 'DRAFT' | 'FINALISED';
  awardedMarks?: number;
  penaltyPercent: number;
  finalMarks?: number;
  rubricScores?: Record<string, number>;
  facultyComments?: string;
  gradedBy?: string;
  gradedAt?: string;
  gradeChangeReason?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  facultyName: string;
  facultyId: string;
  enrolledStudentsCount: number;
  semester: string;
  credits: number;
  description: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: string;
  entity: string;
  details: string;
  status: 'SUCCESS' | 'WARN' | 'ERROR';
}

export interface RiskItem {
  id: string;
  title: string;
  probability: number;
  impact: number;
  exposure: number;
  mitigation: string;
  owner: string;
}

export interface ReconciliationRecord {
  id: string;
  studentRoll: string;
  studentName: string;
  courseCode: string;
  assignmentTitle: string;
  portalFinalMarks: number;
  erpMarks: number;
  status: 'MATCH' | 'MISMATCH';
  lastSynced: string;
}
