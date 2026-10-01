import React from 'react';
import { useApp, SimulatedTimePreset } from '../context/AppContext';
import { formatIST } from '../lib/submissionRules';
import { DEMO_ASSIGNMENT_DEADLINE } from '../data/mockData';
import {
  X,
  Clock,
  Flame,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

interface DemoControlsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoControlsDrawer: React.FC<DemoControlsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    serverTime,
    activePreset,
    setSimulatedPreset,
    resetSimulatedTime,
    deadlineSurgeActive,
    toggleDeadlineSurge,
    surgeMetrics,
    role,
    setRole,
  } = useApp();

  if (!isOpen) return null;

  const presets: Array<{
    id: SimulatedTimePreset;
    title: string;
    offsetDesc: string;
    expectedStatus: string;
    penalty: string;
    color: string;
    badgeBg: string;
  }> = [
    {
      id: 'D_minus_1s',
      title: 'D - 1 second',
      offsetDesc: '1 second before deadline (23:59:58 IST)',
      expectedStatus: 'On Time',
      penalty: '0% Penalty',
      color: 'border-emerald-500 text-emerald-800 bg-emerald-50',
      badgeBg: 'bg-emerald-600',
    },
    {
      id: 'D_exact',
      title: 'D (Exact Deadline)',
      offsetDesc: 'Exact deadline boundary (23:59:59 IST)',
      expectedStatus: 'On Time',
      penalty: '0% Penalty',
      color: 'border-emerald-500 text-emerald-800 bg-emerald-50',
      badgeBg: 'bg-emerald-600',
    },
    {
      id: 'D_plus_1s',
      title: 'D + 1 second',
      offsetDesc: '1s past deadline (00:00:00 IST)',
      expectedStatus: 'Late Band 1',
      penalty: '10% Penalty',
      color: 'border-amber-500 text-amber-800 bg-amber-50',
      badgeBg: 'bg-amber-600',
    },
    {
      id: 'D_plus_24h',
      title: 'D + 24 hours',
      offsetDesc: 'Exact Band 1 ceiling (+24h 00m 00s)',
      expectedStatus: 'Late Band 1',
      penalty: '10% Penalty',
      color: 'border-amber-500 text-amber-800 bg-amber-50',
      badgeBg: 'bg-amber-600',
    },
    {
      id: 'D_plus_24h_1s',
      title: 'D + 24 hours + 1s',
      offsetDesc: 'Crosses into Band 2 (+24h 00m 01s)',
      expectedStatus: 'Late Band 2',
      penalty: '25% Penalty',
      color: 'border-orange-500 text-orange-800 bg-orange-50',
      badgeBg: 'bg-orange-600',
    },
    {
      id: 'D_plus_48h',
      title: 'D + 48 hours',
      offsetDesc: 'Exact Band 2 ceiling (+48h 00m 00s)',
      expectedStatus: 'Late Band 2',
      penalty: '25% Penalty',
      color: 'border-orange-500 text-orange-800 bg-orange-50',
      badgeBg: 'bg-orange-600',
    },
    {
      id: 'D_plus_48h_1s',
      title: 'D + 48 hours + 1s',
      offsetDesc: 'Threshold exceeded (+48h 00m 01s)',
      expectedStatus: 'Portal Closed',
      penalty: 'Upload Blocked',
      color: 'border-rose-500 text-rose-800 bg-rose-50',
      badgeBg: 'bg-rose-600',
    },
    {
      id: 'extension_granted',
      title: 'Extension Granted',
      offsetDesc: 'Simulates student with faculty approval',
      expectedStatus: 'Extended Deadline',
      penalty: '0% Penalty',
      color: 'border-blue-500 text-blue-800 bg-blue-50',
      badgeBg: 'bg-blue-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft overflow-y-auto">
        {/* Drawer Header */}
        <div className="bg-[#1F3864] text-white p-5 flex items-center justify-between sticky top-0 z-10 shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-white/10 border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Demo Control Center</h2>
              <p className="text-xs text-blue-200">
                Interactive time manipulation & load testing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 flex-1">
          {/* Active Status Header Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider">Simulated Server Time</span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Active Clock
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-800">
              {formatIST(serverTime)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Assignment Deadline D: <strong>15 Oct 2026, 23:59:59 IST</strong></span>
            </div>
            {activePreset !== 'real' && (
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-amber-700 font-medium">Time override active</span>
                <button
                  onClick={resetSimulatedTime}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to Real Time
                </button>
              </div>
            )}
          </div>

          {/* Section 1: Boundary Time Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>1. Boundary Rule Presets</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                  8 Boundary Scenarios
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Click a preset to warp the server clock directly to the boundary timestamp. Watch the Student Submit banner and penalty update immediately.
            </p>

            <div className="space-y-2">
              {presets.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSimulatedPreset(preset.id);
                      if (role !== 'student') {
                        setRole('student');
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? `${preset.color} ring-2 ring-blue-500 shadow-sm font-medium`
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{preset.title}</span>
                        <span
                          className={`text-[10px] text-white px-2 py-0.5 rounded-full font-semibold ${preset.badgeBg}`}
                        >
                          {preset.expectedStatus}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {preset.offsetDesc}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-slate-800 text-[11px]">
                        {preset.penalty}
                      </div>
                      {isSelected ? (
                        <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                          Active Now ✓
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 group-hover:text-slate-600 flex items-center justify-end gap-0.5">
                          Test <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Deadline-Time Surge Simulator */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Flame className={`w-5 h-5 ${deadlineSurgeActive ? 'text-red-500 animate-bounce' : 'text-slate-400'}`} />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">2. Deadline-Time Load Surge</h4>
                  <p className="text-[11px] text-slate-500">Simulate 480 students rushing before cutoff</p>
                </div>
              </div>
              <button
                onClick={toggleDeadlineSurge}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  deadlineSurgeActive ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    deadlineSurgeActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Live Meter telemetry */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Active Users</span>
                <span className="text-base font-bold text-slate-800">
                  {surgeMetrics.activeUsers} <span className="text-xs font-normal text-slate-400">/ 480</span>
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Requests / Sec</span>
                <span className="text-base font-bold text-slate-800">
                  {surgeMetrics.rps} <span className="text-xs font-normal text-slate-400">req/s</span>
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">p95 Latency</span>
                <span className={`text-base font-bold ${surgeMetrics.p95LatencyMs > 2500 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {(surgeMetrics.p95LatencyMs / 1000).toFixed(2)}s
                </span>
                <span className="text-[10px] text-slate-400 block">SLA Target &lt; 3.0s</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Error Rate</span>
                <span className="text-base font-bold text-emerald-600">
                  {surgeMetrics.errorRate}%
                </span>
                <span className="text-[10px] text-slate-400 block">SLA Target &lt; 1.0%</span>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>NFR-01 SLA Status: <strong className="text-emerald-700">100% Compliant</strong> (p95 &lt; 3s, error rate &lt; 1%)</span>
            </div>
          </div>

          {/* Section 3: Decision Table Quick Reference */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Decision Table Rules (Policy Spec)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-1">Condition</th>
                    <th className="py-1">Status</th>
                    <th className="py-1">Penalty</th>
                    <th className="py-1">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-1 font-mono text-[10px]">ts ≤ D</td>
                    <td className="py-1 text-emerald-700 font-semibold">On Time</td>
                    <td className="py-1">0%</td>
                    <td className="py-1">Accepted</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-[10px]">D &lt; ts ≤ D+24h</td>
                    <td className="py-1 text-amber-700 font-semibold">Late Band 1</td>
                    <td className="py-1">10%</td>
                    <td className="py-1">Accepted</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-[10px]">D+24h &lt; ts ≤ D+48h</td>
                    <td className="py-1 text-orange-700 font-semibold">Late Band 2</td>
                    <td className="py-1">25%</td>
                    <td className="py-1">Accepted</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-[10px]">ts &gt; D+48h</td>
                    <td className="py-1 text-rose-700 font-semibold">Closed</td>
                    <td className="py-1">100%</td>
                    <td className="py-1 text-rose-600 font-bold">Blocked</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-[10px]">Extension == true</td>
                    <td className="py-1 text-blue-700 font-semibold">Extended D</td>
                    <td className="py-1">0%</td>
                    <td className="py-1">Waived</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1F3864] hover:bg-[#152644] text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Close Controls
          </button>
        </div>
      </div>
    </div>
  );
};
