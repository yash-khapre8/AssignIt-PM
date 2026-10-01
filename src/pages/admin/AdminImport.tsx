import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminImport: React.FC = () => {
  const { addToast } = useApp();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [reportVisible, setReportVisible] = useState<boolean>(true);

  // Rejected rows data specified in requirements
  const rejectedRows = [
    {
      rowNumber: 14,
      rawContent: ',Ramesh Kumar,ramesh.k@univ.ac.in,CS303',
      reason: 'Blank / Missing Student Roll Number',
      action: 'Skipped - Mandatory unique identifier absent',
    },
    {
      rowNumber: 88,
      rawContent: '2024BCS0088,Rahul Kapur,rahul.k@univ.ac.in,CS303',
      reason: 'Duplicate Email address already registered',
      action: 'Skipped - Primary university email collision',
    },
    {
      rowNumber: 204,
      rawContent: '2024BCS0204,Sunita Sen,sunita.s@univ.ac.in,CS999',
      reason: 'Invalid Course Code "CS999" (Not in pilot list)',
      action: 'Skipped - Unrecognized syllabus entity',
    },
    {
      rowNumber: 312,
      rawContent: '2024-BCS-0312,Manish Tiwary,manish.t@univ.ac.in,CS201',
      reason: 'Malformed Roll Number regex format',
      action: 'Skipped - Must match ^202[0-9]BCS[0-9]{4}$ pattern',
    },
    {
      rowNumber: 440,
      rawContent: '2024ECE0040,Pooja Hegde,pooja.h@univ.ac.in,CS301',
      reason: 'Department Mismatch: Student enrolled in ECE, not CSE',
      action: 'Skipped - Pilot restricted to School of Computing',
    },
  ];

  const handleSimulatedUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setReportVisible(true);
      addToast(
        'CSV Import Complete',
        'Parsed 480 rows: 475 successfully enrolled, 5 invalid rows flagged.',
        'success'
      );
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Enrolment Roster CSV Ingestion
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Batch bulk enrol student cohorts into pilot courses with pre-flight schema and format validation
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/60 rounded-2xl p-8 text-center transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">
            Upload Student Enrolment Manifest (CSV)
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Upload institutional CSV containing Roll Number, Full Name, University Email, and Course Code.
          </p>

          <button
            onClick={handleSimulatedUpload}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-[#1F3864] hover:bg-[#152644] text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer disabled:bg-slate-300"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Validating 480 Student Records...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                <span>Simulate CSV Upload (Pilot_Cohorts_480.csv)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Report */}
      {reportVisible && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">
                Total Rows Parsed
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">480</div>
              <div className="text-xs text-slate-400 mt-0.5">Full pilot cohort manifest</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
              <span className="text-[10px] text-emerald-800 font-semibold uppercase">
                Successfully Enrolled
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1">475</div>
              <div className="text-xs text-emerald-700 mt-0.5">98.96% automated pass rate</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-xs">
              <span className="text-[10px] text-rose-800 font-semibold uppercase">
                Rejected / Flagged Rows
              </span>
              <div className="text-2xl font-black text-rose-700 mt-1">5</div>
              <div className="text-xs text-rose-700 mt-0.5">Excluded from ledger insertion</div>
            </div>
          </div>

          {/* Rejected Rows Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Pre-Flight Ingestion Error Log (5 Flagged Rows)
              </h2>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4 text-center">Row #</th>
                    <th className="py-2.5 px-4">Raw CSV Payload Snippet</th>
                    <th className="py-2.5 px-4">Validation Failure Reason</th>
                    <th className="py-2.5 px-4">System Ingestion Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {rejectedRows.map((row) => (
                    <tr key={row.rowNumber} className="hover:bg-rose-50/40">
                      <td className="py-3 px-4 text-center font-bold font-mono text-slate-800">
                        Row {row.rowNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 bg-slate-50/50">
                        {row.rawContent}
                      </td>
                      <td className="py-3 px-4 font-bold text-rose-700">
                        {row.reason}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {row.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-500 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong>Database Integrity Guarantee:</strong> Rejections prevented schema corruption without halting ingestion of valid student records.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
