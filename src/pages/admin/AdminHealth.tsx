import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Server,
  HardDrive,
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export const AdminHealth: React.FC = () => {
  const { deadlineSurgeActive, surgeMetrics } = useApp();

  // Storage metric: 68 GB / 100 GB (68%)
  const storageUsedGb = 68;
  const storageTotalGb = 100;
  const storagePct = Math.round((storageUsedGb / storageTotalGb) * 100);
  const storageAlertThreshold = 80;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          System Health, Infrastructure &amp; SLA Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Live cluster resource utilization, database snapshot verification, and storage quotas
        </p>
      </div>

      {/* System Health Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Uptime */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Cluster Uptime</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              SLA 99.9%
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            99.94%
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>0 outages recorded during pilot semester</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">N+1 AWS ECS redundancy</div>
        </div>

        {/* Tile 2: Storage Used vs Quota */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Storage Capacity</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                storagePct >= storageAlertThreshold
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              Quota: {storageTotalGb} GB
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {storageUsedGb} <span className="text-sm font-normal text-slate-400">/ {storageTotalGb} GB</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                storagePct >= storageAlertThreshold ? 'bg-rose-500' : 'bg-blue-600'
              }`}
              style={{ width: `${storagePct}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>{storagePct}% utilized</span>
            <span>Alert trigger at 80%</span>
          </div>
        </div>

        {/* Tile 3: Database Backups */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">PostgreSQL Backups</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Automated
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            Verified
          </div>
          <div className="text-xs text-slate-600 font-semibold mt-1">
            Last Snapshot: Today, 04:00 AM IST
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            SHA-256 Checksum: Passed (RPO &lt; 15 min)
          </div>
        </div>

        {/* Tile 4: Redis & Edge Cache */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Cache Hit Ratio</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
              Redis v7.2
            </span>
          </div>
          <div className="text-3xl font-black text-purple-700 mt-2">
            94.2%
          </div>
          <div className="text-xs text-purple-700 font-semibold mt-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Offloads 88% of DB read queries</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Mean latency: 1.2 ms</div>
        </div>
      </div>

      {/* Real-time Load & Surge Telemetry */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Active Traffic &amp; NFR-01 SLA Compliance Meter
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Current telemetry metrics {deadlineSurgeActive ? '(480-Student Deadline Surge Active)' : '(Normal Load)'}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold ${
              deadlineSurgeActive
                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {deadlineSurgeActive ? 'SURGE BENCHMARK ACTIVE' : 'STEADY STATE TRAFFIC'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">Active Concurrent Users</span>
            <div className="text-2xl font-black text-slate-800 mt-1">
              {surgeMetrics.activeUsers} <span className="text-xs font-normal text-slate-400">/ 480</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">Ingestion Throughput</span>
            <div className="text-2xl font-black text-slate-800 mt-1">
              {surgeMetrics.rps} <span className="text-xs font-normal text-slate-400">req/s</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">p95 Latency SLA (&lt; 3.0s)</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {(surgeMetrics.p95LatencyMs / 1000).toFixed(2)}s
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">Error Rate SLA (&lt; 1.0%)</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {surgeMetrics.errorRate}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
