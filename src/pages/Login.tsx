import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { USERS } from '../data/mockData';
import {
  GraduationCap,
  Shield,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { setRole, addToast } = useApp();
  const navigate = useNavigate();
  const [ssoLoading, setSsoLoading] = useState(false);

  const handleSelectRole = (selectedRole: Role) => {
    setRole(selectedRole);
    navigate(`/${selectedRole}`);
  };

  const handleFakeSSO = () => {
    setSsoLoading(true);
    setTimeout(() => {
      setSsoLoading(false);
      setRole('student');
      addToast('SSO Authenticated', 'Authenticated via University SAML 2.0 Identity Provider as Aarav Sharma.', 'success');
      navigate('/student');
    }, 900);
  };

  const roleCards = [
    {
      role: 'student' as Role,
      title: 'Student',
      person: USERS.student.name,
      id: USERS.student.rollNumber,
      badge: 'B.Tech CSE Year 3',
      color: 'border-blue-500/40 hover:border-blue-600 hover:bg-blue-50/50',
      icon: GraduationCap,
      iconBg: 'bg-blue-600 text-white',
      desc: 'Submit assignments, view live boundary penalties, review grades and rubrics.',
    },
    {
      role: 'faculty' as Role,
      title: 'Faculty / Evaluator',
      person: USERS.faculty.name,
      id: 'Course Coordinator CS303',
      badge: 'Dept of SE',
      color: 'border-emerald-500/40 hover:border-emerald-600 hover:bg-emerald-50/50',
      icon: BookOpen,
      iconBg: 'bg-emerald-600 text-white',
      desc: 'Create assignments, build rubrics, grade submissions with 0.5 step check, release feedback.',
    },
    {
      role: 'dean' as Role,
      title: 'Dean',
      person: USERS.dean.name,
      id: 'Executive Office',
      badge: 'School of Computing',
      color: 'border-purple-500/40 hover:border-purple-600 hover:bg-purple-50/50',
      icon: Award,
      iconBg: 'bg-purple-600 text-white',
      desc: 'Track 6 pilot courses, audit 6 scale-up conditions, inspect 4 risks and probability heatmap.',
    },
    {
      role: 'assessment_cell' as Role,
      title: 'Assessment Cell',
      person: USERS.assessment_cell.name,
      id: 'Controller of Exams',
      badge: 'Evaluation Division',
      color: 'border-amber-500/40 hover:border-amber-600 hover:bg-amber-50/50',
      icon: CheckCircle2,
      iconBg: 'bg-amber-600 text-white',
      desc: 'Export finalized internal marks, review export audit log, run ERP reconciliation audit.',
    },
    {
      role: 'admin' as Role,
      title: 'Administrator',
      person: USERS.admin.name,
      id: 'Systems & DevOps',
      badge: 'IT Infrastructure',
      color: 'border-rose-500/40 hover:border-rose-600 hover:bg-rose-50/50',
      icon: Shield,
      iconBg: 'bg-rose-600 text-white',
      desc: 'Simulate CSV student enrolment import, monitor server load, storage quota and audit logs.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto w-full pt-4 sm:pt-8">
        {/* University Crest & Branding Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1F3864] text-white shadow-xl mb-4 border border-blue-900/30">
            <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-blue-200" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F3864] tracking-tight">
            AssignIt
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-2 font-medium">
            Assignment Submission, Automated Penalty Verification &amp; Evaluation Portal
          </p>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-blue-100/70 text-blue-900 rounded-full text-xs font-semibold">
            <span>School of Computing</span>
            <span>•</span>
            <span>Pilot Rollout (480 Students • 6 Courses)</span>
          </div>
        </div>

        {/* Primary SSO Login Card */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            <KeyRound className="w-4 h-4 text-blue-600" />
            University Single Sign-On
          </div>

          <button
            onClick={handleFakeSSO}
            disabled={ssoLoading}
            className="w-full py-3.5 px-4 bg-[#1F3864] hover:bg-[#152644] text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-3 cursor-pointer group disabled:opacity-75"
          >
            {ssoLoading ? (
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Connecting to University Identity Provider...</span>
              </div>
            ) : (
              <>
                <span>Sign in with University Credentials</span>
                <ExternalLink className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-500 mt-3">
            Supports Shibboleth / SAML 2.0 &amp; Microsoft Entra ID
          </p>
        </div>

        {/* Demo Fast-Track Role Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-px bg-slate-300 w-16 sm:w-28"></div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              Demo: Continue as…
            </span>
            <div className="h-px bg-slate-300 w-16 sm:w-28"></div>
          </div>

          <p className="text-center text-xs text-slate-500 mb-6">
            Select any persona below to explore role-specific permissions, dashboards, and workflows:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.role}
                  onClick={() => handleSelectRole(card.role)}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between text-left group ${card.color}`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-xs ${card.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                      {card.title}
                    </h3>
                    <div className="text-xs font-semibold text-slate-700 mt-0.5">
                      {card.person}
                    </div>
                    <div className="text-[11px] text-slate-500 mb-2">
                      {card.id}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:translate-x-1 transition-transform">
                    <span>Enter as {card.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pilot Project Summary Box */}
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 sm:p-5 text-xs text-slate-700">
          <div className="flex items-center space-x-2 text-blue-950 font-bold text-sm mb-2">
            <Shield className="w-4 h-4 text-blue-700" />
            <span>Project Overview &amp; Evaluation Governance</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-600">
            <div>
              <strong className="text-slate-800 block mb-0.5">Automated Penalty Bands</strong>
              On-time: 0% • Band 1 (&le;24h): 10% • Band 2 (&le;48h): 25% • Closed (&gt;48h): Upload blocked.
            </div>
            <div>
              <strong className="text-slate-800 block mb-0.5">Rigorous Evaluation Rules</strong>
              Awarded marks 0 to max in 0.5 increments • Final marks = Awarded &times; (1 - Penalty) rounded to 1 decimal.
            </div>
            <div>
              <strong className="text-slate-800 block mb-0.5">Pilot Success KPIs</strong>
              &ge; 95% student portal adoption • &lt; 7 days average feedback turnaround • 0 open critical defects.
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-4">
        AssignIt Academic Prototype • University School of Computing • In-memory mock state
      </div>
    </div>
  );
};
