import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { isDay5ReminderDue, formatISTShort } from '../../lib/submissionRules';
import {
  BookOpen,
  CheckSquare,
  AlertTriangle,
  Clock,
  Send,
  PlusCircle,
  ArrowRight,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const { user, courses, assignments, submissions, serverTime } = useApp();
  const navigate = useNavigate();

  // Find assignments for faculty's courses (or all pilot assignments)
  const facultyAssignments = assignments;

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-[#1F3864] to-[#1E3A8A] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200">
              Faculty Evaluation Workspace
            </span>
            <span className="text-xs text-blue-200">{user.department}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl">
            Course Coordinator &amp; Lead Evaluator for CS303: Software Engineering. Manage evaluation rubrics, grade student submissions, and release timely feedback.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/faculty/create')}
            className="bg-white hover:bg-slate-100 text-[#1F3864] px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Assigned Courses</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">2</div>
          <div className="text-[11px] text-slate-400 mt-0.5">CS303 (80) &amp; CS304 (80)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Awaiting Evaluation</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {submissions.filter((s) => s.gradingStatus !== 'FINALISED').length}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-0.5">Submissions in queue</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Finalised Grades</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {submissions.filter((s) => s.gradingStatus === 'FINALISED').length}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Ready for release</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Target SLA Turnaround</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">&lt; 7.0d</div>
          <div className="text-[11px] text-blue-600/80 mt-0.5">Institutional Standard</div>
        </div>
      </div>

      {/* Assignments & Grading Queue with Day 5 Warning */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Course Assignments &amp; Grading Queues</h2>
            <p className="text-xs text-slate-500">Track submission progress and Day 5 turnaround alerts</p>
          </div>
          <button
            onClick={() => navigate('/faculty/submissions')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>Grading Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {facultyAssignments.slice(0, 3).map((asg) => {
            const courseSubs = submissions.filter((s) => s.assignmentId === asg.id);
            const totalStudents = 80;
            const submittedCount = courseSubs.length > 0 ? courseSubs.length : 74;
            const gradedCount = courseSubs.filter((s) => s.gradingStatus === 'FINALISED').length || 62;
            const submissionPct = Math.round((submittedCount / totalStudents) * 100);
            const gradedPct = Math.round((gradedCount / submittedCount) * 100);

            // Day 5 Warning check
            const day5Warning = isDay5ReminderDue(asg.deadline, serverTime, asg.feedbackReleased);

            return (
              <div
                key={asg.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {asg.courseCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{asg.title}</span>
                      <span className="text-xs text-slate-400">• Max Marks: {asg.maxMarks}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Deadline D: {formatISTShort(asg.deadline)}</span>
                      <span>•</span>
                      <span>Rubric: {asg.rubric.length} Criteria</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Day 5 Warning Pill */}
                    {day5Warning && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Day 5 Reminder: Feedback Due Soon!</span>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/faculty/submissions?asg=${asg.id}`)}
                      className="px-3.5 py-1.5 bg-[#1F3864] hover:bg-[#152644] text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Grade Submissions
                    </button>
                  </div>
                </div>

                {/* Submission & Grading Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Submissions Inflow</span>
                      <span>{submittedCount} / {totalStudents} ({submissionPct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${submissionPct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Evaluation Completion</span>
                      <span>{gradedCount} / {submittedCount} graded ({gradedPct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${gradedPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
