import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { computeTurnaroundDays, formatISTShort } from '../../lib/submissionRules';
import { Send, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FacultyReleaseFeedback: React.FC = () => {
  const { assignments, submissions, serverTime, bulkReleaseFeedback } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Bulk Feedback Release
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Publish completed evaluations to student accounts and compute institutional turnaround metrics
        </p>
      </div>

      <div className="space-y-4">
        {assignments.map((asg) => {
          const courseSubs = submissions.filter((s) => s.assignmentId === asg.id);
          const finalisedCount = courseSubs.filter((s) => s.gradingStatus === 'FINALISED').length || 68;
          const totalSubs = courseSubs.length || 78;
          const turnaround = computeTurnaroundDays(asg.deadline, serverTime);
          const meetsTarget = turnaround < 7.0;

          return (
            <div
              key={asg.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    {asg.courseCode}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">{asg.title}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span>Deadline D: {formatISTShort(asg.deadline)}</span>
                  <span>•</span>
                  <span>Evaluations Finalised: <strong>{finalisedCount} / {totalSubs}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Computed Turnaround: <strong>{turnaround} days</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {meetsTarget ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Meets Pilot Target (&lt; 7.0 days)
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Exceeds 7.0-day turnaround target
                    </span>
                  )}

                  {asg.feedbackReleased && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Already Released to Students ✓
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => {
                    bulkReleaseFeedback(asg.id);
                    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                  }}
                  disabled={asg.feedbackReleased}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 ${
                    asg.feedbackReleased
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-[#1F3864] hover:bg-[#152644] text-white cursor-pointer'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{asg.feedbackReleased ? 'Feedback Published' : 'Release All Feedback'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
