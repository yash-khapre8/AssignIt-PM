import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DeanReadiness: React.FC = () => {
  const { scaleUpApproved, approveScaleUp } = useApp();

  const handleApprove = () => {
    approveScaleUp();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const scaleUpConditions = [
    {
      id: 'c1',
      title: 'Portal Submissions Share',
      threshold: '>= 95.0%',
      currentValue: '96.4%',
      status: 'PASS',
      note: '463 of 480 students submitted directly via AssignIt portal.',
    },
    {
      id: 'c2',
      title: 'Average Feedback Turnaround',
      threshold: '< 7.0 days',
      currentValue: '5.8 days',
      status: 'PASS',
      note: 'All course cohorts published grades well before the 7-day SLA.',
    },
    {
      id: 'c3',
      title: 'Critical / High Severity Defects',
      threshold: '0 Open',
      currentValue: '0 Open',
      status: 'PASS',
      note: 'Zero security, data corruption, or crash defects reported.',
    },
    {
      id: 'c4',
      title: 'Defect Removal Efficiency (DRE)',
      threshold: '>= 85.0%',
      currentValue: '91.2%',
      status: 'PASS',
      note: 'Internal test phase eliminated 31 of 34 identified minor issues.',
    },
    {
      id: 'c5',
      title: 'Pilot Course Adoption & SUS Usability',
      threshold: 'All 6 Courses (SUS >= 70)',
      currentValue: '6 / 6 (Avg 81.5 SUS)',
      status: 'PASS',
      note: 'All 6 courses completed pilot assignments with high usability satisfaction.',
    },
    {
      id: 'c6',
      title: 'NFR-01 SLA Compliance at Deadlines',
      threshold: '0 Breaches (p95 < 3s)',
      currentValue: '0 Breaches (p95 max 2.4s)',
      status: 'PASS',
      note: 'Zero server overload dropouts during peak deadline bursts.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Scale-Up Readiness Governance Audit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Detailed criteria verification and official sign-off for school-wide rollout
          </p>
        </div>

        <button
          onClick={handleApprove}
          disabled={scaleUpApproved}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 ${
            scaleUpApproved
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-[#1F3864] hover:bg-[#152644] text-white cursor-pointer'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{scaleUpApproved ? 'Scale-Up Authorized ✓' : 'Approve Scale-Up Rollout'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <span className="font-bold text-sm text-slate-900">
            6 Verification Conditions (All 6 Passed)
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Ready for Full Scale-up
          </span>
        </div>

        <div className="space-y-3">
          {scaleUpConditions.map((cond, idx) => (
            <div
              key={cond.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                  <h4 className="font-bold text-sm text-slate-900">{cond.title}</h4>
                </div>
                <p className="text-xs text-slate-600">{cond.note}</p>
                <div className="text-[11px] font-mono text-slate-500">
                  Required Standard: <strong>{cond.threshold}</strong> &bull; Current Pilot: <strong>{cond.currentValue}</strong>
                </div>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>CRITERION MET</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
