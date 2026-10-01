import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Submission, RubricCriterion } from '../../types';
import {
  computeFinalMarks,
  validateAwardedMarks,
  formatISTShort,
} from '../../lib/submissionRules';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  User,
  ExternalLink,
  Save,
  Send,
  X,
  PlusCircle,
  FileCheck,
  Shield,
  Eye,
  Calendar,
} from 'lucide-react';

export const FacultySubmissions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultAsgId = searchParams.get('asg') || 'asg_se_01';

  const {
    assignments,
    submissions,
    saveGrade,
    grantExtension,
    serverTime,
  } = useApp();

  const [selectedAsgId, setSelectedAsgId] = useState<string>(defaultAsgId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [extensionSubmission, setExtensionSubmission] = useState<Submission | null>(null);

  const currentAssignment =
    assignments.find((a) => a.id === selectedAsgId) || assignments[0];

  const assignmentSubmissions = submissions.filter(
    (s) => s.assignmentId === currentAssignment.id
  );

  // Filtered submissions
  const filteredSubmissions = assignmentSubmissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentRoll.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'UNGRADED') return sub.gradingStatus === 'UNGRADED';
    if (statusFilter === 'DRAFT') return sub.gradingStatus === 'DRAFT';
    if (statusFilter === 'FINALISED') return sub.gradingStatus === 'FINALISED';
    if (statusFilter === 'LATE') return sub.status.includes('LATE');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Assignment Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Submissions &amp; Evaluation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review student deliverables, grade with rubric weights, and grant extension waivers
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Assignment:</label>
          <select
            value={selectedAsgId}
            onChange={(e) => setSelectedAsgId(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500"
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.courseCode}: {a.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Submissions</span>
          <div className="text-lg font-bold text-slate-900">{assignmentSubmissions.length}</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">Grading Pending</span>
          <div className="text-lg font-bold text-amber-600">
            {assignmentSubmissions.filter((s) => s.gradingStatus !== 'FINALISED').length}
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">Finalised</span>
          <div className="text-lg font-bold text-emerald-600">
            {assignmentSubmissions.filter((s) => s.gradingStatus === 'FINALISED').length}
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">Late Submissions</span>
          <div className="text-lg font-bold text-red-600">
            {assignmentSubmissions.filter((s) => s.status.includes('LATE')).length}
          </div>
        </div>
      </div>

      {/* Table Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'UNGRADED', 'DRAFT', 'FINALISED', 'LATE'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  statusFilter === filter
                    ? 'bg-[#1F3864] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'ALL' ? 'All Rows' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Submission Status</th>
                <th className="py-3 px-4">Versions</th>
                <th className="py-3 px-4">Late Penalty</th>
                <th className="py-3 px-4">Awarded / Final</th>
                <th className="py-3 px-4">Grading State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => {
                  const activeVer = sub.versions[sub.activeVersion - 1];
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{sub.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{sub.studentRoll}</div>
                        {sub.extensionGranted && (
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            Extension Granted
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {sub.status === 'NOT_SUBMITTED' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            Not Submitted
                          </span>
                        ) : sub.status === 'ON_TIME' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            On Time
                          </span>
                        ) : sub.status === 'LATE_BAND_1' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Late Band 1 (0–24h)
                          </span>
                        ) : sub.status === 'LATE_BAND_2' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                            Late Band 2 (24–48h)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            Closed
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">
                          {sub.versions.length > 0 ? `v${sub.activeVersion} / 5` : 'None'}
                        </span>
                        {activeVer && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {activeVer.fileName}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold">
                        {sub.penaltyPercent > 0 ? (
                          <span className="text-red-600">-{sub.penaltyPercent}%</span>
                        ) : (
                          <span className="text-emerald-700">0%</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {sub.awardedMarks !== undefined ? (
                          <div>
                            <div className="font-bold text-slate-900">
                              {sub.finalMarks}{' '}
                              <span className="text-xs font-normal text-slate-400">
                                / {currentAssignment.maxMarks}
                              </span>
                            </div>
                            {sub.penaltyPercent > 0 && (
                              <div className="text-[10px] text-slate-500">
                                (Awarded: {sub.awardedMarks})
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not graded</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {sub.gradingStatus === 'FINALISED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Finalised
                          </span>
                        ) : sub.gradingStatus === 'DRAFT' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            <Save className="w-3 h-3" />
                            Draft Saved
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            Ungraded
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        {sub.status !== 'NOT_SUBMITTED' ? (
                          <button
                            onClick={() => setGradingSubmission(sub)}
                            className="px-3 py-1.5 bg-[#1F3864] hover:bg-[#152644] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                          >
                            {sub.gradingStatus === 'FINALISED' ? 'Review / Edit' : 'Grade File'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic mr-2">No File</span>
                        )}

                        <button
                          onClick={() => setExtensionSubmission(sub)}
                          className="px-2.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          title="Grant student deadline extension"
                        >
                          Extension
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    No submissions matched the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Split-Screen Grading View Modal */}
      {gradingSubmission && (
        <GradingModal
          submission={gradingSubmission}
          assignment={currentAssignment}
          onClose={() => setGradingSubmission(null)}
          onSave={saveGrade}
        />
      )}

      {/* Extension Grant Dialog Modal */}
      {extensionSubmission && (
        <ExtensionModal
          submission={extensionSubmission}
          assignment={currentAssignment}
          onClose={() => setExtensionSubmission(null)}
          onConfirm={(deadline, reason) => {
            grantExtension(extensionSubmission.id, deadline, reason);
            setExtensionSubmission(null);
          }}
        />
      )}
    </div>
  );
};

// Split-Screen Grading Modal
interface GradingModalProps {
  submission: Submission;
  assignment: any;
  onClose: () => void;
  onSave: (
    subId: string,
    awardedMarks: number,
    scores: Record<string, number>,
    comments: string,
    isFinal: boolean,
    reason?: string
  ) => { success: boolean; error?: string };
}

const GradingModal: React.FC<GradingModalProps> = ({
  submission,
  assignment,
  onClose,
  onSave,
}) => {
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(() => {
    if (submission.rubricScores) return { ...submission.rubricScores };
    const initial: Record<string, number> = {};
    assignment.rubric.forEach((r: RubricCriterion) => {
      initial[r.id] = r.maxMarks * 0.8; // default sensible starter
    });
    return initial;
  });

  const [comments, setComments] = useState<string>(
    submission.facultyComments || 'Methodical analysis with good architectural diagram structure.'
  );
  const [changeReason, setChangeReason] = useState<string>(
    submission.gradeChangeReason || ''
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Compute awarded sum
  const awardedMarks = Object.values(rubricScores).reduce((acc, v) => acc + (Number(v) || 0), 0);
  const finalMarks = computeFinalMarks(awardedMarks, submission.penaltyPercent);
  const isPreviouslyFinalised = submission.gradingStatus === 'FINALISED';

  const handleScoreChange = (criterionId: string, value: number, max: number) => {
    setValidationError(null);
    const clamped = Math.max(0, Math.min(max, value));
    setRubricScores((prev) => ({
      ...prev,
      [criterionId]: clamped,
    }));
  };

  const handleSaveDraft = () => {
    const res = onSave(submission.id, awardedMarks, rubricScores, comments, false);
    if (res.success) onClose();
    else setValidationError(res.error || 'Failed to save draft');
  };

  const handleFinalise = () => {
    const val = validateAwardedMarks(awardedMarks, assignment.maxMarks);
    if (!val.valid) {
      setValidationError(val.error || 'Invalid marks');
      return;
    }

    if (isPreviouslyFinalised && !changeReason.trim() && submission.awardedMarks !== awardedMarks) {
      setValidationError(
        'Audit compliance rule: You must provide a formal reason when modifying an already finalised grade.'
      );
      return;
    }

    const res = onSave(submission.id, awardedMarks, rubricScores, comments, true, changeReason);
    if (res.success) onClose();
    else setValidationError(res.error || 'Failed to finalise');
  };

  const activeVersion = submission.versions[submission.activeVersion - 1];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col border border-slate-200 animate-fadeIn">
        {/* Modal Top Header */}
        <div className="bg-[#1F3864] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/10">
              <FileCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Grading Workspace: {submission.studentName} ({submission.studentRoll})
              </h2>
              <div className="text-xs text-blue-200">
                {assignment.courseCode} • {assignment.title} • Version {submission.activeVersion}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split Screen Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* Left Column (7 cols): Document Preview Placeholder */}
          <div className="lg:col-span-7 border-r border-slate-200 bg-slate-100/70 p-4 flex flex-col justify-between overflow-y-auto">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  {activeVersion?.fileName || 'submission_file.pdf'}
                </span>
                <span className="text-[11px] text-slate-400">
                  ({((activeVersion?.fileSize || 3500000) / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                PDF Viewer (Page 1 of 6)
              </span>
            </div>

            {/* Document Render Simulation */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex-1 shadow-inner overflow-y-auto font-serif text-slate-800 text-xs leading-relaxed space-y-4">
              <div className="border-b border-slate-200 pb-3 text-center">
                <h3 className="font-bold text-sm font-sans text-slate-900">
                  Software Architecture &amp; C4 Decomposition
                </h3>
                <p className="text-[11px] font-sans text-slate-500 mt-0.5">
                  Author: {submission.studentName} (Roll: {submission.studentRoll}) • School of Computing
                </p>
              </div>

              <div>
                <h4 className="font-bold font-sans text-xs uppercase text-slate-700 mb-1">
                  1. Context Diagram (C4 Level 1)
                </h4>
                <p>
                  The proposed triage system bridges patient intake kiosks, emergency ward telemetry, and physician scheduling. All asynchronous state changes emit CloudEvents over Apache Kafka to guarantee sub-millisecond decoupled ingestion during peak crisis triage events.
                </p>
                <div className="my-3 p-4 bg-slate-50 border border-slate-300 rounded-lg text-center font-mono text-[11px] text-slate-600">
                  [ SIMULATED DIAGRAM: External Patient Portal &lt;--&gt; Triage API Gateway &lt;--&gt; Hospital DB ]
                </div>
              </div>

              <div>
                <h4 className="font-bold font-sans text-xs uppercase text-slate-700 mb-1">
                  2. Architectural Tradeoffs &amp; NFR Matrix
                </h4>
                <p>
                  Synchronous HTTP REST requests are limited strictly to idempotent patient identification lookups. All lab test allocations utilize an event-driven choreography pattern to eliminate cascading HTTP thread starvation failures.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg font-sans text-[11px] text-blue-900">
                <strong>Student Reflection Note:</strong> Addressed all 4 rubric criteria including NFR trace matrix and IEEE compliance diagrams.
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-400 text-center">
              Evaluator Preview • Embedded PDF simulation
            </div>
          </div>

          {/* Right Column (5 cols): Rubric Scoring & Comments Box */}
          <div className="lg:col-span-5 p-5 flex flex-col justify-between overflow-y-auto bg-white space-y-5">
            <div className="space-y-4">
              {/* Penalty Notice */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px] uppercase">
                    Submission Timestamp
                  </span>
                  <span className="font-bold text-slate-800">
                    {submission.status} (-{submission.penaltyPercent}% penalty)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-semibold block text-[10px] uppercase">
                    Penalty Factor
                  </span>
                  <span className="font-bold text-red-600">
                    &times;{(1 - submission.penaltyPercent / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Rubric Criteria Sliders/Inputs */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Rubric Scoring (0.5 Step increments)
                </h3>
                <div className="space-y-3">
                  {assignment.rubric.map((r: RubricCriterion) => {
                    const currentVal = rubricScores[r.id] ?? 0;
                    return (
                      <div
                        key={r.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{r.title}</span>
                          <span className="font-extrabold text-xs text-blue-900">
                            {currentVal.toFixed(1)} / {r.maxMarks}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{r.description}</p>
                        <div className="flex items-center gap-3 pt-1">
                          <input
                            type="range"
                            min="0"
                            max={r.maxMarks}
                            step="0.5"
                            value={currentVal}
                            onChange={(e) =>
                              handleScoreChange(r.id, parseFloat(e.target.value), r.maxMarks)
                            }
                            className="flex-1 accent-blue-600 cursor-pointer"
                          />
                          <input
                            type="number"
                            min="0"
                            max={r.maxMarks}
                            step="0.5"
                            value={currentVal}
                            onChange={(e) =>
                              handleScoreChange(r.id, parseFloat(e.target.value), r.maxMarks)
                            }
                            className="w-16 p-1 text-xs font-bold text-right border border-slate-300 rounded bg-white"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comments Box */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Faculty Evaluator Comments
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide qualitative feedback on design choices, code quality, and formatting..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Justification if changing finalised grade */}
              {isPreviouslyFinalised && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                  <label className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-amber-700" />
                    Formal Audit Reason for Grade Modification *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Student re-evaluation request approved by HOD."
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    className="w-full text-xs bg-white border border-amber-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              {/* Live Marks Math Summary Banner */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-900 block">
                    Awarded: {awardedMarks.toFixed(1)} / {assignment.maxMarks}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    After -{submission.penaltyPercent}% penalty:
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#1F3864]">
                    Final: {finalMarks.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-500">pts</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Rounded to 1 decimal</div>
                </div>
              </div>

              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleFinalise}
                  className="px-5 py-2 bg-[#1F3864] hover:bg-[#152644] text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalise Grade</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extension Grant Dialog Modal
interface ExtensionModalProps {
  submission: Submission;
  assignment: any;
  onClose: () => void;
  onConfirm: (extendedDeadline: string, reason: string) => void;
}

const ExtensionModal: React.FC<ExtensionModalProps> = ({
  submission,
  assignment,
  onClose,
  onConfirm,
}) => {
  const [extDate, setExtDate] = useState<string>('2026-10-18T23:59');
  const [reason, setReason] = useState<string>('Medical cert verified by University Health Centre (MED-REF-8902)');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Grant Deadline Extension
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-slate-600 space-y-1">
          <p>
            Student: <strong>{submission.studentName}</strong> ({submission.studentRoll})
          </p>
          <p>
            Assignment: <strong>{assignment.courseCode} – {assignment.title}</strong>
          </p>
          <p className="text-[11px] text-slate-500">
            Current Deadline D: {formatISTShort(assignment.deadline)}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            New Extended Deadline (IST) *
          </label>
          <input
            type="datetime-local"
            value={extDate}
            onChange={(e) => setExtDate(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 font-bold"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Official Reason &amp; Reference Code *
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="p-3 bg-blue-50 rounded-xl text-[11px] text-blue-900 border border-blue-200">
          <strong>Policy Notice:</strong> Granting this extension sets the student's submission ceiling to the new timestamp and waives late penalty bands accordingly.
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(new Date(extDate).toISOString(), reason)}
            className="px-4 py-2 bg-[#1F3864] hover:bg-[#152644] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
          >
            Authorize Extension
          </button>
        </div>
      </div>
    </div>
  );
};
