import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatISTShort } from '../../lib/submissionRules';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ShieldCheck,
  CheckCheck,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const AssessmentCellReconciliation: React.FC = () => {
  const {
    reconciliationRows,
    injectedMismatch,
    toggleInjectedMismatch,
  } = useApp();

  const mismatchCount = reconciliationRows.filter((r) => r.status === 'MISMATCH').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            ERP Ledger Reconciliation Audit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cross-verifies marks stored on AssignIt with the Central University ERP Examination database
          </p>
        </div>

        {/* Demo Toggle to inject 1 mismatch */}
        <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-900 block">
              Demo Test Mode: Inject Mismatch
            </span>
            <span className="text-[10px] text-slate-500">
              {injectedMismatch ? '1 discrepancy injected' : 'Normal state (0 mismatches)'}
            </span>
          </div>

          <button
            onClick={toggleInjectedMismatch}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              injectedMismatch ? 'bg-amber-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                injectedMismatch ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Reconciliation Status Banner */}
      <div
        className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
          mismatchCount === 0
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-rose-50 border-rose-300 text-rose-950 animate-pulse'
        }`}
      >
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-white/80 shadow-xs shrink-0 mt-0.5">
            {mismatchCount === 0 ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base">
                Audit Result: {mismatchCount === 0 ? 'Zero Discrepancies (100% Match)' : `${mismatchCount} Grade Mismatch Detected`}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/90">
                480 Synced Records
              </span>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {mismatchCount === 0
                ? 'All finalized grades recorded in AssignIt match the cryptographic hash stored in the central ERP assessment register.'
                : 'Attention required: An inconsistency was detected between the final rubric score and the external ERP entry.'}
            </p>
          </div>
        </div>

        {mismatchCount > 0 && (
          <button
            onClick={toggleInjectedMismatch}
            className="px-4 py-2 bg-[#1F3864] hover:bg-[#152644] text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0 flex items-center space-x-2 cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span>Resync with ERP Ledger</span>
          </button>
        )}
      </div>

      {/* Reconciliation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <GitCompare className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Student Ledger Cross-Verification (CS303)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Last automated sweep: Today, 18:30 IST
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Student Roll</th>
                <th className="py-2.5 px-4">Student Name</th>
                <th className="py-2.5 px-4">Course &amp; Task</th>
                <th className="py-2.5 px-4 text-center">Portal Marks</th>
                <th className="py-2.5 px-4 text-center">ERP System Marks</th>
                <th className="py-2.5 px-4 text-center">Difference</th>
                <th className="py-2.5 px-4 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {reconciliationRows.map((row) => {
                const diff = +(row.portalFinalMarks - row.erpMarks).toFixed(1);
                const isMismatch = row.status === 'MISMATCH';

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      isMismatch ? 'bg-rose-50/80 font-bold' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {row.studentRoll}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {row.studentName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {row.courseCode} – {row.assignmentTitle}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-blue-900">
                      {row.portalFinalMarks}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {row.erpMarks}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      {diff === 0 ? (
                        <span className="text-slate-400">0.0</span>
                      ) : (
                        <span className="text-rose-600 bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                          {diff > 0 ? `+${diff}` : diff} pts
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isMismatch ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-200 px-2.5 py-0.5 rounded-full border border-rose-300">
                          <AlertTriangle className="w-3 h-3" />
                          FLAGGED MISMATCH
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIED MATCH
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
