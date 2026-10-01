import React from 'react';
import { useApp, SimulatedTimePreset } from '../context/AppContext';
import { Role } from '../types';
import { formatIST } from '../lib/submissionRules';
import {
  Clock,
  Sliders,
  Activity,
  GraduationCap,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Flame,
  AlertTriangle,
  Menu,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleMobileNav: () => void;
  onOpenDemoDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav, onOpenDemoDrawer }) => {
  const {
    role,
    setRole,
    user,
    serverTime,
    activePreset,
    deadlineSurgeActive,
  } = useApp();
  const navigate = useNavigate();

  const roleLabels: Record<Role, { title: string; color: string }> = {
    student: { title: 'Student', color: 'bg-blue-600' },
    faculty: { title: 'Faculty', color: 'bg-emerald-600' },
    dean: { title: 'Dean', color: 'bg-purple-600' },
    assessment_cell: { title: 'Assessment Cell', color: 'bg-amber-600' },
    admin: { title: 'Administrator', color: 'bg-rose-600' },
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    navigate(`/${newRole}`);
  };

  const getPresetLabel = (preset: SimulatedTimePreset) => {
    switch (preset) {
      case 'D_minus_1s': return 'Preset: D - 1s (On Time)';
      case 'D_exact': return 'Preset: Deadline D (0%)';
      case 'D_plus_1s': return 'Preset: D + 1s (Late 10%)';
      case 'D_plus_24h': return 'Preset: D + 24h (Late 10%)';
      case 'D_plus_24h_1s': return 'Preset: D + 24h + 1s (Late 25%)';
      case 'D_plus_48h': return 'Preset: D + 48h (Late 25%)';
      case 'D_plus_48h_1s': return 'Preset: D + 48h + 1s (Closed)';
      case 'extension_granted': return 'Preset: Extension Active';
      default: return 'Live Real Time';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#1F3864] text-white shadow-md border-b border-[#2D4F8B]">
      {/* Top Banner for Active Simulated Time & Surge */}
      {(activePreset !== 'real' || deadlineSurgeActive) && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-semibold flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            <span>
              <strong>DEMO ACTIVE:</strong> {getPresetLabel(activePreset)}
              {deadlineSurgeActive && ' • 480-User Deadline Surge Active (p95 < 3s, Err < 1%)'}
            </span>
          </div>
          <button
            onClick={onOpenDemoDrawer}
            className="underline hover:text-white transition-colors cursor-pointer text-xs"
          >
            Adjust Demo Controls
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onToggleMobileNav}
              className="md:hidden p-2 rounded-md text-slate-200 hover:text-white hover:bg-[#2D4F8B] focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div
              onClick={() => navigate(`/${role}`)}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
                <GraduationCap className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white">AssignIt</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                    Pilot
                  </span>
                </div>
                <p className="text-[11px] text-blue-200/80 hidden sm:block font-medium">
                  School of Computing Portal
                </p>
              </div>
            </div>
          </div>

          {/* Center: Server Time Clock */}
          <div className="hidden lg:flex items-center px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-blue-100 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-blue-300 mr-2 animate-pulse" />
            <span className="font-medium mr-1.5 text-blue-200">Server Clock:</span>
            <span className="font-mono font-semibold tracking-wide text-white">
              {formatIST(serverTime)}
            </span>
            <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
          </div>

          {/* Right: Role Switcher & Demo Drawer Trigger */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Quick Demo Controls Trigger Button */}
            <button
              onClick={onOpenDemoDrawer}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                deadlineSurgeActive || activePreset !== 'real'
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 border-amber-300 shadow-md animate-bounce'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title="Open Demo Controls (Boundary Time Presets & Surge Load)"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Demo Controls</span>
              {deadlineSurgeActive && (
                <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
              )}
            </button>

            {/* Role Switcher Pill/Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2 bg-black/25 hover:bg-black/35 px-2.5 py-1.5 rounded-lg border border-white/15 cursor-pointer transition-colors">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow ${roleLabels[role].color}`}
                >
                  {role === 'student' && 'S'}
                  {role === 'faculty' && 'F'}
                  {role === 'dean' && 'D'}
                  {role === 'assessment_cell' && 'A'}
                  {role === 'admin' && 'AD'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold leading-tight text-white flex items-center gap-1">
                    {user.name.split(' ')[0]}
                    <span className="text-[10px] text-blue-200">({roleLabels[role].title})</span>
                  </div>
                  <div className="text-[10px] text-blue-200/70 truncate max-w-[130px]">
                    Switch demo role
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl py-1 border border-slate-200 text-slate-800 hidden group-hover:block z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Switch Active Role
                  </p>
                  <p className="text-xs text-slate-600">Simulates role permissions & views</p>
                </div>

                <button
                  onClick={() => handleRoleChange('student')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    role === 'student' ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Student (Aarav Sharma)</span>
                  </div>
                  {role === 'student' && <UserCheck className="w-3.5 h-3.5 text-blue-600" />}
                </button>

                <button
                  onClick={() => handleRoleChange('faculty')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                    role === 'faculty' ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Faculty (Dr. Vikram Malhotra)</span>
                  </div>
                  {role === 'faculty' && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                </button>

                <button
                  onClick={() => handleRoleChange('dean')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-purple-50 transition-colors ${
                    role === 'dean' ? 'bg-purple-50 font-semibold text-purple-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span>Dean (Prof. Ramaswamy)</span>
                  </div>
                  {role === 'dean' && <UserCheck className="w-3.5 h-3.5 text-purple-600" />}
                </button>

                <button
                  onClick={() => handleRoleChange('assessment_cell')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                    role === 'assessment_cell' ? 'bg-amber-50 font-semibold text-amber-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span>Assessment Cell (Mr. Sen)</span>
                  </div>
                  {role === 'assessment_cell' && <UserCheck className="w-3.5 h-3.5 text-amber-600" />}
                </button>

                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-rose-50 transition-colors ${
                    role === 'admin' ? 'bg-rose-50 font-semibold text-rose-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    <span>Administrator (Ms. Bhatt)</span>
                  </div>
                  {role === 'admin' && <UserCheck className="w-3.5 h-3.5 text-rose-600" />}
                </button>

                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                >
                  Return to Role Login Screen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
