import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  evaluateSubmissionStatus,
  formatIST,
  getCountdown,
} from '../../lib/submissionRules';
import {
  Calendar,
  Clock,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  UploadCloud,
  ChevronLeft,
  Shield,
  Layers,
} from 'lucide-react';

export const StudentAssignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assignments, submissions, serverTime, activePreset, user } = useApp();

  // Find assignment (default to the demo assignment if not specified)
  const assignment = assignments.find((a) => a.id === id) || assignments[0];
  const userSubmission = submissions.find(
    (s) => s.assignmentId === assignment.id && s.studentRoll === user.rollNumber
  );

  const evalResult = evaluateSubmissionStatus(
    serverTime,
    assignment.deadline,
    userSubmission?.extensionGranted || activePreset === 'extension_granted',
    userSubmission?.extendedDeadline
  );

  const countdown = getCountdown(assignment.deadline, serverTime);

  return (
    <div className="space-y-6">
      {/* Back button and navigation */}
      <button
        onClick={() => navigate('/student/assignments')}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Assignments List
      </button>

      {/* Live Boundary Status Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs ${evalResult.bannerClass}`}
      >
        <div className="flex items-start space-x-3.5">
          <div className="p-2 rounded-xl bg-white/80 shadow-xs mt-0.5">
            {evalResult.status === 'ON_TIME' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {evalResult.status === 'LATE_BAND_1' && <Clock className="w-5 h-5 text-amber-600" />}
            {evalResult.status === 'LATE_BAND_2' && <AlertTriangle className="w-5 h-5 text-orange-600" />}
            {evalResult.status === 'CLOSED' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base">
                Submission Status: {evalResult.label}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 shadow-2xs">
                {evalResult.penaltyPercent}% Penalty
              </span>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-95">
              {evalResult.description}
            </p>
            <div className="text-[11px] mt-1.5 opacity-80 flex items-center gap-2 flex-wrap font-mono">
              <span>Evaluated against Server Clock: {formatIST(serverTime)}</span>
            </div>
          </div>
        </div>

        {evalResult.uploadAllowed ? (
          <button
            onClick={() => navigate(`/student/submit?asg=${assignment.id}`)}
            className="px-4 py-2.5 bg-[#1F3864] hover:bg-[#152644] text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Work Now</span>
          </button>
        ) : (
          <div className="px-3 py-2 bg-rose-200/80 text-rose-900 rounded-xl text-xs font-bold text-center shrink-0">
            Upload Window Expired
          </div>
        )}
      </div>

      {/* Main Assignment Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
              {assignment.courseCode} • {assignment.courseName}
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Max Marks:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {assignment.maxMarks} points
              </span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {assignment.title}
          </h1>
        </div>

        {/* Timelines and Policy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 uppercase font-semibold text-[10px] block">
              Published Date
            </span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {formatIST(assignment.publishedAt)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 uppercase font-semibold text-[10px] block">
              Hard Deadline D
            </span>
            <span className="font-bold text-red-700 mt-0.5 block">
              {formatIST(assignment.deadline)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 uppercase font-semibold text-[10px] block">
              Time Remaining
            </span>
            <span className={`font-bold mt-0.5 block ${countdown.isPast ? 'text-red-600' : 'text-emerald-700'}`}>
              {countdown.text}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Assignment Specifications &amp; Instructions
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            {assignment.instructions}
          </div>
        </div>

        {/* Attachments */}
        {assignment.attachmentName && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Faculty Reference Material</h3>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors max-w-md">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">{assignment.attachmentName}</div>
                  <div className="text-[10px] text-slate-400">PDF Document • 2.4 MB</div>
                </div>
              </div>
              <button
                onClick={() => alert(`Simulated download for: ${assignment.attachmentName}`)}
                className="p-2 text-blue-700 hover:text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
                title="Download Attachment"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Rubric Criteria Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Evaluation Rubric Breakdown
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Total: {assignment.rubric.reduce((acc, r) => acc + r.maxMarks, 0)} / {assignment.maxMarks} marks
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Evaluation Criterion</th>
                  <th className="py-2.5 px-4">Assessment Guide</th>
                  <th className="py-2.5 px-4 text-right">Max Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {assignment.rubric.map((crit) => (
                  <tr key={crit.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 w-1/3">
                      {crit.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {crit.description}
                    </td>
                    <td className="py-3 px-4 font-bold text-right text-blue-900 w-24">
                      {crit.maxMarks} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submission Version Info if existing */}
        {userSubmission && userSubmission.versions.length > 0 && (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Active Submission on File</h4>
                  <p className="text-[11px] text-emerald-800">
                    Latest: Version {userSubmission.activeVersion} ({userSubmission.versions[userSubmission.activeVersion - 1]?.fileName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/student/submit?asg=' + assignment.id)}
                className="text-xs font-bold text-emerald-900 underline hover:text-emerald-700"
              >
                View Version History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const StudentAssignments: React.FC = () => {
  const { assignments, submissions, serverTime, user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Enrolled Course Assignments</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Click any assignment to review specifications, rubric weights, and live submission status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((asg) => {
          const sub = submissions.find(
            (s) => s.assignmentId === asg.id && s.studentRoll === user.rollNumber
          );
          const countdown = getCountdown(asg.deadline, serverTime);
          const isSubmitted = sub && sub.versions.length > 0;

          return (
            <div
              key={asg.id}
              onClick={() => navigate(`/student/assignments/${asg.id}`)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {asg.courseCode}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Max: {asg.maxMarks} marks
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 hover:text-blue-700 mb-1">
                  {asg.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {asg.instructions}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{countdown.text}</span>
                </div>
                {isSubmitted ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Submitted (v{sub.activeVersion})
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Not Submitted
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
