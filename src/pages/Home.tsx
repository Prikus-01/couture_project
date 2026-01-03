import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-5 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4.5 bg-gradient-to-br from-[#2c4c71] via-[#446285] to-[#5cacfa] bg-clip-text text-transparent leading-tight">
            StoreAdmin Portal
          </h1>
          <p className="text-lg text-[#5c6468] leading-relaxed max-w-2xl mx-auto">
            Your comprehensive inventory management portal. Browse, analyze, and manage your product catalog with ease and style.
          </p>
        </div>

        {/* Main Feature Cards */}
        <div className="grid md:grid-cols-2 gap-7 max-w-5xl mx-auto mb-16">
          {/* Inventory Card */}
          <div className="group bg-white rounded-[14px] p-8 shadow-md hover:shadow-xl border border-[#a5b8cc]/30 hover:border-[#5cacfa]/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5cacfa]/10 to-transparent rounded-bl-full -mr-8 -mt-8"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#2c8cfb] to-[#5cacfa] rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-[24px] font-semibold text-[#2c4c71] mb-3.5">
                Inventory Overview
              </h2>
              <p className="text-[15px] text-[#5c6468] leading-relaxed mb-6">
                View all your products in a comprehensive table format. Sort by price or name, filter by category, and search for specific items instantly.
              </p>
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2c8cfb] text-white rounded-[9px] font-semibold text-[15px] shadow-md hover:bg-[#1a7ae8] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                View Inventory
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Catalogue Card */}
          <div className="group bg-white rounded-[14px] p-8 shadow-md hover:shadow-xl border border-[#a5b8cc]/30 hover:border-[#5cacfa]/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#446285]/10 to-transparent rounded-bl-full -mr-8 -mt-8"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#446285] to-[#2c4c71] rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-[24px] font-semibold text-[#2c4c71] mb-3.5">
                Product Catalogue
              </h2>
              <p className="text-[15px] text-[#5c6468] leading-relaxed mb-6">
                Explore your product catalog by category. Browse through all available categories and drill down into specific product groups.
              </p>
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2c8cfb] text-white rounded-[9px] font-semibold text-[15px] shadow-md hover:bg-[#1a7ae8] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                Browse Catalogue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl p-12 shadow-lg border border-[#a5b8cc]/20">
          <h2 className="text-[30px] font-semibold text-[#2c4c71] text-center mb-10">
            Everything you need to manage your inventory efficiently
          </h2>
          <div className="grid md:grid-cols-3 gap-9">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#5cacfa]/20 to-[#2c8cfb]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#5cacfa]/30">
                <svg className="w-8 h-8 text-[#2c8cfb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold text-[#446285] mb-2.5">
                Quick Search
              </h3>
              <p className="text-[15px] text-[#5c6468] leading-relaxed">
                Instantly find products by name with our responsive search functionality.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#5cacfa]/20 to-[#2c8cfb]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#5cacfa]/30">
                <svg className="w-8 h-8 text-[#2c8cfb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold text-[#446285] mb-2.5">
                Smart Filters
              </h3>
              <p className="text-[15px] text-[#5c6468] leading-relaxed">
                Filter products by category and sort by price or name for efficient browsing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#5cacfa]/20 to-[#2c8cfb]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#5cacfa]/30">
                <svg className="w-8 h-8 text-[#2c8cfb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold text-[#446285] mb-2.5">
                Responsive Design
              </h3>
              <p className="text-[15px] text-[#5c6468] leading-relaxed">
                Access your inventory from any device - desktop, tablet, or mobile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}