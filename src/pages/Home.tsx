import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg">
              🎯 Professional Inventory Management
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Welcome to StoreAdmin
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Your comprehensive inventory management portal. Browse, analyze, and manage your
            product catalog with ease and style.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Inventory Card */}
          <div className="group relative bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-300 transform hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-bl-full opacity-50"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 mr-4 shadow-lg transform group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Inventory Overview
                </h2>
              </div>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                View all your products in a comprehensive table format. Sort by price or name,
                filter by category, and search for specific items instantly.
              </p>
              <Link
                to="/inventory"
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
              >
                <span>View Inventory</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Catalogue Card */}
          <div className="group relative bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-yellow-300 transform hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-bl-full opacity-50"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 mr-4 shadow-lg transform group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  Catalogue Overview
                </h2>
              </div>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Explore your product catalog by category. Browse through all available categories
                and drill down into specific product groups.
              </p>
              <Link
                to="/catalogue"
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
              >
                <span>Browse Catalogue</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-purple-100">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Key Features
            </h2>
            <p className="text-gray-600 text-lg">Everything you need to manage your inventory efficiently</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Instantly find products by name with our responsive search functionality.
              </p>
            </div>

            <div className="group text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Filtering</h3>
              <p className="text-gray-600 leading-relaxed">
                Filter products by category and sort by price or name for efficient browsing.
              </p>
            </div>

            <div className="group text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Friendly</h3>
              <p className="text-gray-600 leading-relaxed">
                Access your inventory from any device - desktop, tablet, or mobile.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

