import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  LayoutDashboard, 
  Award, 
  Layers, 
  Network, 
  Menu, 
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function PublicNavbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', path: '/', icon: Home },
    { label: 'Dashboard', path: '/publik/dashboard', icon: LayoutDashboard },
    { label: 'Pengawasan', path: '/publik/pengawasan', icon: Award },
    { label: 'Program Kerja', path: '/publik/proker', icon: Layers },
    { label: 'Struktur DPM', path: '/publik/struktur', icon: Network }
  ];

  const isCurrent = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group shrink-0 select-none py-1"
          >
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-2xs group-hover:border-red-500 transition-colors">
              <img 
                src="/logos/logo-dpm.png" 
                alt="Logo DPM FASILKOM UMB" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 tracking-tight text-xs xs:text-sm sm:text-base leading-tight group-hover:text-red-600 transition-colors">
                  DPM FASILKOM
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200/70 hidden sm:inline-block">
                  UMB
                </span>
              </div>
              <span className="text-[10px] xs:text-[11px] font-medium text-slate-500 leading-tight truncate max-w-[160px] xs:max-w-none">
                Portal Transparansi Ormawa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((item) => {
              const active = isCurrent(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-normal transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none ${
                    active
                      ? 'bg-red-50 text-red-700 font-bold border border-red-100 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.icon && <item.icon className={`w-3.5 h-3.5 ${active ? 'text-red-600' : 'text-slate-400'}`} />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger Toggle (Min 44x44px Accessible Touch Target) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden transition active:scale-95"
              aria-label="Toggle menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-md px-4 pt-3 pb-5 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
          <p className="px-3 text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">
            Menu Publik
          </p>
          {navLinks.map((item) => {
            const active = isCurrent(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  active
                    ? 'bg-red-50 text-red-700 font-bold border border-red-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon ? (
                    <item.icon className={`w-4 h-4 ${active ? 'text-red-600' : 'text-slate-400'}`} />
                  ) : (
                    <ShieldCheck className={`w-4 h-4 ${active ? 'text-red-600' : 'text-slate-400'}`} />
                  )}
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
