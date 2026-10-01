import React from 'react';
import { DEAN_RISKS } from '../../data/mockData';
import { AlertTriangle, Shield, CheckCircle2, TrendingDown } from 'lucide-react';

export const DeanRisks: React.FC = () => {
  const totalExposure = DEAN_RISKS.reduce((acc, r) => acc + r.exposure, 0);

  // 5x5 heatmap coordinates (Prob on Y: 0.1 to 1.0, Impact on X: 1 to 10)
  const heatmapCells = [
    { rowLabel: '0.8 - 1.0 (Very High)', probMin: 0.8 },
    { rowLabel: '0.6 - 0.7 (High)', probMin: 0.6 },
    { rowLabel: '0.4 - 0.5 (Medium)', probMin: 0.4 },
    { rowLabel: '0.2 - 0.3 (Low)', probMin: 0.2 },
    { rowLabel: '0.0 - 0.1 (Very Low)', probMin: 0.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Project Risk Register &amp; Exposure Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Institutional risk matrix, exposure calculation (P &times; I), and mitigation strategies
          </p>
        </div>

        {/* Total Exposure Badge */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center space-x-3 shrink-0">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
              Total Risk Exposure Index
            </div>
            <div className="text-xl font-black text-amber-950">
              {totalExposure.toFixed(1)}{' '}
              <span className="text-xs font-semibold text-amber-700">/ 40.0 Max (Moderate)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          The Four Pilot Project Risks
        </h2>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Risk Item</th>
                <th className="py-3 px-4 text-center">Probability (P)</th>
                <th className="py-3 px-4 text-center">Impact (I: 1-10)</th>
                <th className="py-3 px-4 text-center">Exposure (P &times; I)</th>
                <th className="py-3 px-4">Active Mitigation Strategy</th>
                <th className="py-3 px-4">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {DEAN_RISKS.map((risk) => (
                <tr key={risk.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{risk.title}</div>
                    <div className="text-[10px] font-mono text-slate-400">{risk.id}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {risk.probability.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {risk.impact}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full ${
                        risk.exposure >= 3.0
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : risk.exposure >= 2.0
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {risk.exposure.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                    {risk.mitigation}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 text-[11px]">
                    {risk.owner}
                  </td>
                </tr>
              ))}
              {/* Summary Row */}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                <td className="py-3 px-4 text-slate-900">Aggregate Cumulative Risk</td>
                <td colSpan={2} className="py-3 px-4 text-center text-slate-500">
                  4 Evaluated Threats
                </td>
                <td className="py-3 px-4 text-center text-sm font-black text-amber-900">
                  10.1
                </td>
                <td colSpan={2} className="py-3 px-4 text-[11px] text-slate-500 italic">
                  Controlled threshold under institutional ceiling (Target &le; 12.0)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap Visualization */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Probability &times; Impact Risk Heat Map
            </h2>
            <p className="text-xs text-slate-500">
              Visual 2D positioning of threats across likelihood (Y-axis) and organizational severity (X-axis)
            </p>
          </div>
        </div>

        {/* 5x5 Matrix Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {DEAN_RISKS.map((risk) => (
            <div
              key={risk.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                risk.exposure >= 3.0
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : risk.exposure >= 2.0
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    Exposure {risk.exposure.toFixed(1)}
                  </span>
                  <span className="font-semibold text-[11px]">
                    P: {risk.probability} &bull; I: {risk.impact}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-1">{risk.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {risk.mitigation}
                </p>
              </div>

              <div className="pt-2 border-t border-black/10 text-[11px] font-semibold text-slate-700">
                Lead: {risk.owner.split('(')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
