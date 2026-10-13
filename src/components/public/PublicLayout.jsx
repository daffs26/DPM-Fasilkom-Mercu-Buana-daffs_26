import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import PublicPreloader from './PublicPreloader';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-red-600 selection:text-white">
      <PublicPreloader />
      <PublicNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children || <Outlet />}
      </main>
      <PublicFooter />
    </div>
  );
}
