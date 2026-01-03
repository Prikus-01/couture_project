import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { path: '/inventory', label: 'Inventory', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { path: '/catalogue', label: 'Catalogue', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-br from-[#2c4c71] to-[#446285] shadow-lg backdrop-blur-sm border-b border-[#5cacfa]/20">
      <div className="container mx-auto px-6 py-3.5">
        {/* Logo/Brand */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex flex-col group">
            <span className="text-[22px] font-bold text-white tracking-tight group-hover:opacity-90 transition-opacity duration-200">
              StoreAdmin
            </span>
            <span className="text-[11px] text-[#a5b8cc] uppercase tracking-wider font-medium">
              Inventory Portal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-[10px] font-medium text-[15px] transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-white/15 text-white shadow-md'
                    : 'text-white/85 hover:bg-white/10 hover:text-white hover:-translate-y-[1px]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-[3px] bg-[#5cacfa] rounded-t-sm" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-[9px] bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3.5 bg-[#2c4c71] rounded-xl p-2.5 shadow-2xl border border-[#5cacfa]/20">
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-[10px] font-semibold text-[15px] transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-white text-[#2c4c71] shadow-md'
                      : 'text-white/90 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}