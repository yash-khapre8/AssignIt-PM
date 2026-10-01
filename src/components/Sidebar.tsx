import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  Award,
  PlusCircle,
  CheckSquare,
  Send,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  Download,
  GitCompare,
  Upload,
  Server,
  ScrollText,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { role, user } = useApp();

  const getNavLinks = () => {
    switch (role) {
      case 'student':
        return [
          { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
          { to: '/student/assignments', label: 'My Assignments', icon: FileText },
          { to: '/student/submit', label: 'Submit Work', icon: UploadCloud },
          { to: '/student/results', label: 'Grades & Feedback', icon: Award },
        ];
      case 'faculty':
        return [
          { to: '/faculty', label: 'Faculty Dashboard', icon: LayoutDashboard, end: true },
          { to: '/faculty/create', label: 'Create Assignment', icon: PlusCircle },
          { to: '/faculty/submissions', label: 'Grading Queue', icon: CheckSquare },
          { to: '/faculty/feedback', label: 'Release Feedback', icon: Send },
        ];
      case 'dean':
        return [
          { to: '/dean', label: 'Pilot KPI Dashboard', icon: PieChart, end: true },
          { to: '/dean/readiness', label: 'Scale-Up Readiness', icon: ShieldCheck },
          { to: '/dean/risks', label: 'Risk Matrix & Heatmap', icon: AlertTriangle },
        ];
      case 'assessment_cell':
        return [
          { to: '/assessment_cell', label: 'Marks Export', icon: Download, end: true },
          { to: '/assessment_cell/reconciliation', label: 'Reconciliation Audit', icon: GitCompare },
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Enrolment Import', icon: Upload, end: true },
          { to: '/admin/health', label: 'System Health & SLA', icon: Server },
          { to: '/admin/logs', label: 'Audit Logs', icon: ScrollText },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 h-[100dvh] md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 shrink-0 transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Mobile Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between md:hidden bg-[#1F3864] text-white">
            <span className="font-bold text-sm">Navigation</span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded text-blue-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center overflow-hidden shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-blue-700 font-bold text-sm">{user.name[0]}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 truncate">{user.name}</div>
                <div className="text-[11px] text-slate-500 truncate">
                  {user.rollNumber || user.department.split(',')[0]}
                </div>
                <div className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider mt-0.5">
                  {role.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu Navigation
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#1F3864] text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Role Info / Pilot Specs */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
          <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
            <span>Pilot Scope</span>
            <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
              6 Courses
            </span>
          </div>
          <div className="text-[10px] text-slate-500 leading-tight">
            480 Students • Target &gt;95% portal submissions &amp; &lt;7d turnaround
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Quick Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        {navLinks.slice(0, 4).map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded text-[10px] font-medium transition-colors ${
                  isActive ? 'text-[#1F3864] font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="truncate max-w-[65px]">{link.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};
