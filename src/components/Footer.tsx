import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 text-xs text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>AssignIt</strong> – Academic Assessment &amp; Evaluation Portal (School of Computing)
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            Demo build, in-memory mock data
          </span>
          <span>•</span>
          <span>SLA: 99.94% Uptime</span>
          <span>•</span>
          <span>Server Clock: IST (UTC+05:30)</span>
        </div>
      </div>
    </footer>
  );
};
