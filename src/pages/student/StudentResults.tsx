import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { computeTurnaroundDays, formatISTShort } from '../../lib/submissionRules';
import {
  Award,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export const StudentResults: React.FC = () => {
  const { assignments, submissions, user } = useApp();

  // Find graded submissions for this student
  const studentSubs = submissions.filter(
    (s) => s.studentRoll === user.rollNumber && s.gradingStatus === 'FINALISED'
  );

  const [selectedSubId, setSelectedSubId] = useState<string>(
    studentSubs[0]?.id || ''
  );

  const selectedSub = studentSubs.find((s) => s.id === selectedSubId) || studentSubs[0];
  const selectedAsg = assignments.find((a) => a.id === selectedSub?.assignmentId);

  const turnaround = selectedAsg && selectedSub?.gradedAt
    ? computeTurnaroundDays(selectedAsg.deadline, selectedSub.gradedAt)
    : 4.8;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Grades &amp; Evaluation Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Official assessment marks, penalty audit breakdowns, and faculty feedback notes
        </p>
      </div>

      {studentSubs.length > 0 && selectedSub && selectedAsg ? (
        <div className="space-y-6">
          {/* Assignment Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {studentSubs.map((sub) => {
              const asg = assignments.find((a) => a.id === sub.assignmentId);
              const isActive = sub.id === selectedSub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubId(sub.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#1F3864] text-white border-[#1F3864] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sub.courseCode}: {asg?.title.split(':')[0] || 'Assignment'}
                </button>
              );
            })}
          </div>

          {/* Primary Marks Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="border-b border-slate-200 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                  {selectedSub.courseCode}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedAsg.title}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Evaluated by: <strong>{selectedSub.gradedBy || 'Faculty Evaluator'}</strong>
                </div>
              </div>

              {/* Turnaround Badge */}
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs text-emerald-800">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Feedback Turnaround: <strong>{turnaround} days</strong> (Target &lt; 7.0d)</span>
              </div>
            </div>

            {/* Marks Math Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                  Raw Rubric Awarded
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {selectedSub.awardedMarks}
                  <span className="text-xs font-normal text-slate-400"> / {selectedAsg.maxMarks}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Sum of criteria marks (0.5 steps)
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                  Late Penalty Applied
                </span>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {selectedSub.penaltyPercent > 0 ? `-${selectedSub.penaltyPercent}%` : '0%'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {selectedSub.status === 'ON_TIME' ? 'Submitted On Time' : `Deducted (${selectedSub.status})`}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300 shadow-2xs">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                  Net Final Grade
                </span>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {selectedSub.finalMarks}
                  <span className="text-xs font-normal text-emerald-600"> / {selectedAsg.maxMarks}</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  Awarded &times; (1 - {selectedSub.penaltyPercent / 100})
                </div>
              </div>
            </div>
          </div>

          {/* Rubric Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Detailed Rubric Itemization
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Rubric Criterion</th>
                    <th className="py-2.5 px-4">Weight / Guide</th>
                    <th className="py-2.5 px-4 text-right">Awarded Score</th>
                    <th className="py-2.5 px-4 text-right">Attainment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {selectedAsg.rubric.map((r) => {
                    const score = selectedSub.rubricScores?.[r.id] ?? (r.maxMarks * 0.9);
                    const pct = Math.round((score / r.maxMarks) * 100);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-900 w-1/3">
                          {r.title}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {r.description}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-blue-900">
                          {score.toFixed(1)} / {r.maxMarks}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Faculty Evaluator Comments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Faculty Evaluator Feedback &amp; Suggestions
            </h3>
            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 text-xs text-slate-800 leading-relaxed italic">
              "{selectedSub.facultyComments || 'Comprehensive work conforming to guidelines.'}"
            </div>
            <div className="text-[11px] text-slate-400">
              Evaluator: {selectedSub.gradedBy} • Feedback officially released via Portal on {formatISTShort(selectedSub.gradedAt || '')}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          No graded feedback records released yet for your account. Submissions currently in evaluation queue.
        </div>
      )}
    </div>
  );
};
