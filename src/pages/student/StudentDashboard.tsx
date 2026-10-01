import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getCountdown, formatISTShort } from '../../lib/submissionRules';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  UploadCloud,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, courses, assignments, submissions, serverTime } = useApp();
  const navigate = useNavigate();

  // Find submissions for this student
  const studentSubmissions = submissions.filter((s) => s.studentRoll === user.rollNumber);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1F3864] to-[#2D4F8B] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-200">
              Student Portal
            </span>
            <span className="text-xs text-blue-200">Roll: {user.rollNumber}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl">
            You are enrolled in 6 pilot courses in the School of Computing. Stay ahead of deadlines to avoid late submission penalty deductions.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/submit')}
          className="bg-white hover:bg-blue-50 text-[#1F3864] px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 text-blue-600" />
          <span>Submit Assignment</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Enrolled Courses</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{courses.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Semester 5 B.Tech</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Upcoming Deadlines</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">2</div>
          <div className="text-[11px] text-amber-600/80 mt-0.5">Due within 72 hours</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Submitted Works</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {studentSubmissions.filter((s) => s.status !== 'NOT_SUBMITTED').length}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Verified on ledger</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Graded &amp; Released</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {studentSubmissions.filter((s) => s.gradingStatus === 'FINALISED').length}
          </div>
          <div className="text-[11px] text-purple-600/80 mt-0.5">With rubric breakdown</div>
        </div>
      </div>

      {/* Active Assignments & Deadlines */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Upcoming Assignments &amp; Deadlines</h2>
            <p className="text-xs text-slate-500">Live countdown relative to university server clock</p>
          </div>
          <button
            onClick={() => navigate('/student/assignments')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {assignments.slice(0, 3).map((assignment) => {
            const countdown = getCountdown(assignment.deadline, serverTime);
            const userSub = studentSubmissions.find((s) => s.assignmentId === assignment.id);
            const isSubmitted = userSub && userSub.versions.length > 0;

            return (
              <div
                key={assignment.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {assignment.courseCode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {assignment.courseName}
                    </span>
                    <span className="text-xs text-slate-400">• Max Marks: {assignment.maxMarks}</span>
                  </div>
                  <h3
                    onClick={() => navigate(`/student/assignments/${assignment.id}`)}
                    className="font-bold text-sm text-slate-900 hover:text-blue-700 cursor-pointer"
                  >
                    {assignment.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Due: {formatISTShort(assignment.deadline)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                  {/* Countdown Timer */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-semibold">
                      <Clock
                        className={`w-3.5 h-3.5 ${
                          countdown.isPast
                            ? 'text-red-500'
                            : countdown.severity === 'urgent'
                            ? 'text-amber-500 animate-pulse'
                            : 'text-blue-500'
                        }`}
                      />
                      <span
                        className={
                          countdown.isPast
                            ? 'text-red-600'
                            : countdown.severity === 'urgent'
                            ? 'text-amber-600 font-bold'
                            : 'text-slate-700'
                        }
                      >
                        {countdown.text}
                      </span>
                    </div>

                    {/* Status Chip */}
                    <div className="mt-1">
                      {isSubmitted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Submitted (v{userSub.activeVersion})
                        </span>
                      ) : countdown.isPast ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3" />
                          Late Submission
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          Not Submitted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/student/submit?asg=${assignment.id}`)}
                    className="px-3.5 py-2 bg-[#1F3864] hover:bg-[#152644] text-white rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-xs"
                  >
                    {isSubmitted ? 'Replace / View' : 'Submit Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Feedback & Enrolled Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Feedback Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">Recent Graded Feedback</h2>
            </div>
            <button
              onClick={() => navigate('/student/results')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              All Results
            </button>
          </div>

          <div className="space-y-3">
            {studentSubmissions
              .filter((s) => s.gradingStatus === 'FINALISED')
              .map((sub) => {
                const asg = assignments.find((a) => a.id === sub.assignmentId);
                return (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-lg border border-purple-100 bg-purple-50/40 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-200/70 text-purple-900">
                          {sub.courseCode}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 mt-1">{asg?.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 italic line-clamp-2">
                          "{sub.facultyComments}"
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="text-base font-extrabold text-purple-700">
                          {sub.finalMarks}{' '}
                          <span className="text-xs font-normal text-slate-500">
                            / {asg?.maxMarks}
                          </span>
                        </div>
                        {sub.penaltyPercent > 0 && (
                          <div className="text-[10px] text-red-600 font-semibold">
                            -{sub.penaltyPercent}% Late Penalty
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Enrolled Courses (Pilot)</h2>
            </div>
            <span className="text-xs text-slate-400">School of Computing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-blue-900">{course.code}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{course.credits} Credits</span>
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate">{course.name}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{course.facultyName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
