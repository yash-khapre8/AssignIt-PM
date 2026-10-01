import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PEER_STUDENTS } from '../../data/mockData';
import { formatIST, formatISTShort } from '../../lib/submissionRules';
import {
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  History,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AssessmentCellExport: React.FC = () => {
  const {
    courses,
    assignments,
    submissions,
    exportMarks,
    exportLogs,
    user,
  } = useApp();

  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('CS303');
  const [selectedAsgId, setSelectedAsgId] = useState<string>('asg_se_02');

  const currentCourse = courses.find((c) => c.code === selectedCourseCode) || courses[0];
  const currentAssignment = assignments.find((a) => a.id === selectedAsgId) || assignments[0];

  // Synthesize realistic internal assessment records for the 20 peer students
  const assessmentRows = PEER_STUDENTS.map((student, idx) => {
    const rawMarks = +(32 + (idx * 0.7) % 7.5).toFixed(1);
    const capped = Math.min(currentAssignment.maxMarks, rawMarks);
    const attendance = 82 + (idx * 3) % 18;
    return {
      roll: student.roll,
      name: student.name,
      courseCode: selectedCourseCode,
      assignment: currentAssignment.title,
      internalMark: capped,
      maxMarks: currentAssignment.maxMarks,
      attendancePct: attendance,
      normalizedScore: +((capped / currentAssignment.maxMarks) * 20).toFixed(1), // out of 20 internal weighting
      grade: capped >= 36 ? 'O' : capped >= 32 ? 'A+' : capped >= 28 ? 'A' : 'B+',
      status: 'FINALISED',
    };
  });

  const handleExport = () => {
    exportMarks(selectedCourseCode, currentAssignment.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Assessment Cell &amp; Marks Export Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate audited internal assessment award sheets for university Controller of Examinations
          </p>
        </div>

        <button
          onClick={handleExport}
          className="bg-[#1F3864] hover:bg-[#152644] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Finalised Marks (.CSV)</span>
        </button>
      </div>

      {/* Selectors Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Choose Course
          </label>
          <select
            value={selectedCourseCode}
            onChange={(e) => setSelectedCourseCode(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
          >
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} – {c.name} ({c.facultyName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Choose Assignment
          </label>
          <select
            value={selectedAsgId}
            onChange={(e) => setSelectedAsgId(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
          >
            {assignments
              .filter((a) => a.courseCode === selectedCourseCode)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} (Max: {a.maxMarks})
                </option>
              ))}
            {assignments.filter((a) => a.courseCode === selectedCourseCode).length === 0 && (
              <option value={assignments[0].id}>{assignments[0].title}</option>
            )}
          </select>
        </div>
      </div>

      {/* Internal Assessment Sheet Layout Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Internal Assessment Award Sheet Layout Preview
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Format conforms to University Examination Board Form COE-IA-04
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Displaying Sample Cohort (20 of 80 enrolled)
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Roll Number</th>
                <th className="py-2.5 px-4">Student Name</th>
                <th className="py-2.5 px-4 text-center">Marks Awarded</th>
                <th className="py-2.5 px-4 text-center">Attendance %</th>
                <th className="py-2.5 px-4 text-center">Weight / 20</th>
                <th className="py-2.5 px-4 text-center">Tentative Grade</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {assessmentRows.map((row) => (
                <tr key={row.roll} className="hover:bg-slate-50/60 font-mono text-[11px]">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{row.roll}</td>
                  <td className="py-2.5 px-4 font-sans font-semibold text-slate-800">
                    {row.name}
                  </td>
                  <td className="py-2.5 px-4 text-center font-bold text-blue-900">
                    {row.internalMark} / {row.maxMarks}
                  </td>
                  <td className="py-2.5 px-4 text-center text-slate-600">
                    {row.attendancePct}%
                  </td>
                  <td className="py-2.5 px-4 text-center font-bold text-slate-800">
                    {row.normalizedScore}
                  </td>
                  <td className="py-2.5 px-4 text-center font-bold text-purple-700">
                    {row.grade}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <History className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Export Audit Ledger &amp; Revision Log
          </h2>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Export Timestamp</th>
                <th className="py-2.5 px-4">Authorized Exporter</th>
                <th className="py-2.5 px-4">Course &amp; Task</th>
                <th className="py-2.5 px-4 text-center">Row Count</th>
                <th className="py-2.5 px-4 text-center">Revised / Repeat Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {exportLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {formatIST(log.time)}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.user}</td>
                  <td className="py-3 px-4 font-semibold text-blue-900">
                    {log.courseCode} – {log.assignment}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">
                    {log.rowCount} records
                  </td>
                  <td className="py-3 px-4 text-center">
                    {log.isRepeat ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        REVISED (Repeat)
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Initial Export
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
