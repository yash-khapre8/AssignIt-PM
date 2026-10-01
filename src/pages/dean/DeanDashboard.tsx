import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  PieChart as PieChartIcon,
  CheckCircle2,
  TrendingUp,
  Clock,
  AlertTriangle,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import confetti from 'canvas-confetti';

export const DeanDashboard: React.FC = () => {
  const { courses, scaleUpApproved, approveScaleUp } = useApp();
  const navigate = useNavigate();

  // Recharts course data
  const courseChartData = [
    { name: 'CS201 DS', adoptionRate: 98.0, avgFeedbackDays: 5.2, usabilityScore: 84 },
    { name: 'CS202 DB', adoptionRate: 95.5, avgFeedbackDays: 6.1, usabilityScore: 79 },
    { name: 'CS301 OS', adoptionRate: 97.2, avgFeedbackDays: 5.4, usabilityScore: 82 },
    { name: 'CS302 CN', adoptionRate: 94.8, avgFeedbackDays: 6.4, usabilityScore: 78 },
    { name: 'CS303 SE', adoptionRate: 98.5, avgFeedbackDays: 5.1, usabilityScore: 86 },
    { name: 'CS304 WT', adoptionRate: 94.5, avgFeedbackDays: 6.6, usabilityScore: 80 },
  ];

  // 6 Pilot Scale-Up Conditions
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

  const handleApprove = () => {
    approveScaleUp();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Dean Executive Banner */}
      <div className="bg-gradient-to-r from-[#1F3864] to-[#3B1F64] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/30 text-purple-200">
              Executive Deanery Cockpit
            </span>
            <span className="text-xs text-blue-200">School of Computing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Prof. K. R. Ramaswamy – Pilot Governance
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl">
            Monitoring 480 pilot students across 6 computing courses. Verify scale-up readiness metrics before authorizing university-wide semester rollout.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/dean/risks')}
            className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-white/20 transition-all cursor-pointer"
          >
            Inspect Risk Panel (10.1 Exposure)
          </button>
        </div>
      </div>

      {/* 4 Core Pilot KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Portal Share */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Portal Adoption</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Target &ge; 95%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            96.4%
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+1.4% above institutional success threshold</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">463 / 480 students</div>
        </div>

        {/* KPI 2: Feedback Turnaround */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Avg Feedback Time</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Target &lt; 7.0d
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            5.8 <span className="text-sm font-normal text-slate-400">days</span>
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>-1.2 days faster than pre-portal baseline</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Target turnaround compliance</div>
        </div>

        {/* KPI 3: Late Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Late Submissions</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              Bands 1 &amp; 2
            </span>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">
            7.9% <span className="text-sm font-normal text-slate-400">(38)</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Band 1 (10%): 26 • Band 2 (25%): 12
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Automated penalty ledger applied</div>
        </div>

        {/* KPI 4: Pending Grading */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Pending Grading</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              Live Queue
            </span>
          </div>
          <div className="text-3xl font-extrabold text-blue-700 mt-2">
            14 <span className="text-sm font-normal text-slate-400">works</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            97.1% of all semester tasks evaluated
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Zero overdue past Day 7</div>
        </div>
      </div>

      {/* Chart Section: Recharts Course Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Pilot Course Performance Comparison
            </h2>
            <p className="text-xs text-slate-500">
              Adoption share vs Average feedback turnaround days across the 6 pilot cohorts
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600">
            School of Computing Pilot (N = 480)
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis yAxisId="left" orientation="left" domain={[85, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 8]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="adoptionRate" name="Portal Adoption % (Left Axis)" fill="#1F3864" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="avgFeedbackDays" name="Avg Turnaround Days (Right Axis)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scale-Up Readiness Checklist & Executive Approval */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Institutional Scale-Up Readiness Audit
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict 6-condition governance checklist required before full university expansion
            </p>
          </div>

          {/* Verdict Banner */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Verdict: 6 / 6 Conditions Passed (Green)</span>
            </div>

            <button
              onClick={handleApprove}
              disabled={scaleUpApproved}
              className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 ${
                scaleUpApproved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#1F3864] hover:bg-[#152644] text-white cursor-pointer'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{scaleUpApproved ? 'Scale-Up Approved ✓' : 'Approve Scale-Up'}</span>
            </button>
          </div>
        </div>

        {/* 6 Checklist Conditions Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Policy Standard</th>
                <th className="py-3 px-4">Pilot Result</th>
                <th className="py-3 px-4">Audit Note</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {scaleUpConditions.map((cond) => (
                <tr key={cond.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">{cond.title}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600 font-mono text-[11px]">
                    {cond.threshold}
                  </td>
                  <td className="py-3 px-4 font-bold text-blue-900">{cond.currentValue}</td>
                  <td className="py-3 px-4 text-slate-500">{cond.note}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {cond.status}
                    </span>
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
