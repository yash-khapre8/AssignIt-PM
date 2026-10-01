import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatIST } from '../../lib/submissionRules';
import { ScrollText, Search, Filter, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AdminLogs: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (roleFilter !== 'ALL' && log.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Immutable System Audit Logs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Append-only tamper-evident security and evaluation ledger across all roles
        </p>
      </div>

      {/* Audit Log Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search user, action, entity, or receipt ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'student', 'faculty', 'dean', 'assessment_cell', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize shrink-0 ${
                  roleFilter === r
                    ? 'bg-[#1F3864] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Timestamp (IST)</th>
                <th className="py-2.5 px-4">Actor &amp; Role</th>
                <th className="py-2.5 px-4">Action Event</th>
                <th className="py-2.5 px-4">Target Entity</th>
                <th className="py-2.5 px-4">Audit Details &amp; Payload</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                  <td className="py-3 px-4 text-slate-500 shrink-0">
                    {formatIST(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">
                    <div>{log.user}</div>
                    <span className="text-[10px] font-semibold text-blue-700 uppercase">
                      {log.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700">
                    {log.entity}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600 text-[11px] max-w-sm">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.status}
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
