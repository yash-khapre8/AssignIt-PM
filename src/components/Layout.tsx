import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ToastContainer } from './ToastContainer';
import { DemoControlsDrawer } from './DemoControlsDrawer';
import { Sliders, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [demoDrawerOpen, setDemoDrawerOpen] = useState(false);
  const { deadlineSurgeActive, activePreset } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navbar Header */}
      <Header
        onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
        onOpenDemoDrawer={() => setDemoDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Demo Controls Action Button */}
      <button
        onClick={() => setDemoDrawerOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer border ${
          deadlineSurgeActive || activePreset !== 'real'
            ? 'bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-300/40 animate-pulse'
            : 'bg-[#1F3864] text-white border-blue-400/40 hover:bg-[#152644]'
        }`}
        title="Open Demo Controls (Boundary Time Presets & Surge Meter)"
      >
        <Sliders className="w-5 h-5" />
        <span className="text-xs font-bold hidden sm:inline">
          Demo Controls
        </span>
        {deadlineSurgeActive && (
          <Flame className="w-4 h-4 text-red-600 fill-red-600" />
        )}
      </button>

      {/* Demo Controls Drawer Modal */}
      <DemoControlsDrawer
        isOpen={demoDrawerOpen}
        onClose={() => setDemoDrawerOpen(false)}
      />

      {/* Toast Alert Popups */}
      <ToastContainer />
    </div>
  );
};
