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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    )},
    { path: '/catalogue', label: 'Catalogue', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white shadow-xl border-b-4 border-purple-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform"></div>
              <div className="relative bg-gradient-to-br from-yellow-300 to-orange-400 rounded-lg p-2 transform group-hover:scale-105 transition-transform">
                <svg className="w-7 h-7 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                StoreAdmin
              </span>
              <span className="text-xs text-purple-200 font-medium">Inventory Portal</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center space-x-2 group ${
                  isActive(item.path)
                    ? 'bg-white text-purple-700 shadow-lg scale-105'
                    : 'text-purple-100 hover:text-white hover:bg-white/20 hover:scale-105'
                }`}
              >
                <span className={isActive(item.path) ? 'text-purple-600' : 'text-purple-200 group-hover:text-yellow-300'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-purple-700 to-indigo-800 border-t-2 border-purple-400/50 shadow-inner">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-base transition-all ${
                  isActive(item.path)
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'text-purple-100 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span className={isActive(item.path) ? 'text-purple-600' : 'text-purple-200'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

