import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import PublicPreloader from './PublicPreloader';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-red-600 selection:text-white overflow-x-clip">
      <PublicPreloader />
      <PublicNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-hidden sm:overflow-visible">
        {children || <Outlet />}
      </main>
      <PublicFooter />
    </div>
  );
}
