import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Product, SortOption } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Link } from 'react-router-dom';

export default function InventoryOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await api.getCategories();
        setAllCategories(categories);
      } catch (err) {
        // Categories fetch failure is not critical
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products - handle initial load, category and page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const skip = (page - 1) * perPage;
        let data;
        if (selectedCategory) {
          data = await api.getProductsByCategory(selectedCategory, perPage, skip);
        } else {
          data = await api.getProducts(skip, perPage);
        }
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, page, perPage]);

  // When search query changes, reset to first page
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Search functionality with debouncing (respecting page & perPage)
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If search is cleared, simply let the other effect (selectedCategory, page) handle fetching
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);
      const skip = (page - 1) * perPage;
      api
        .searchProducts(searchQuery, perPage, skip)
        .then((data) => {
          setProducts(data.products);
          setTotal(data.total);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Search failed');
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, page, perPage]);

  // Filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category (if search is not active)
    if (selectedCategory && !searchQuery.trim()) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sort products
    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;

        if (sortBy === 'name') {
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
        } else {
          aVal = a.price;
          bVal = b.price;
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, selectedCategory, sortBy, sortDirection, searchQuery]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when filtering by category
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  if (error && !products.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Inventory Overview
            </span>
          </h1>
          <p className="text-xl text-gray-700">Manage and browse your product inventory</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-purple-100">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Search Products
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                📂 Filter by Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
              >
                <option value="">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🔢 Sort By</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort('name')}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    sortBy === 'name'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('price')}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    sortBy === 'price'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  Price {sortBy === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading && products.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAndSortedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-lg font-semibold text-gray-500">No products found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-purple-50/50 cursor-pointer transition-all duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/product/${product.id}`}
                              className="flex items-center group"
                            >
                              <div className="relative">
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="h-12 w-12 rounded-lg object-cover mr-4 ring-2 ring-gray-200 group-hover:ring-purple-400 transition-all"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                  {product.title}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                  <span className="text-yellow-500 mr-1">⭐</span>
                                  {product.rating.toFixed(1)}
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                            {product.brand}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">
                              ${product.price.toFixed(2)}
                            </div>
                            {product.discountPercentage > 0 && (
                              <span className="text-xs text-orange-600 font-semibold">
                                {product.discountPercentage.toFixed(0)}% off
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                            {product.stock} units
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${stockStatus.color}`}
                            >
                              {stockStatus.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {loading && products.length > 0 && (
              <div className="px-6 py-4 bg-purple-50/50 text-center text-sm text-purple-700 font-semibold">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                  Updating results...
                </div>
              </div>
            )}

            {/* Pagination controls */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/90 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{total === 0 ? 0 : (page - 1) * perPage + 1}</span> - <span className="font-semibold">{Math.min(page * perPage, total)}</span> of <span className="font-semibold">{total}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <label className="text-sm mr-2 text-gray-600">Per page</label>
                  <select
                    value={perPage}
                    onChange={(e) => { setPerPage(parseInt(e.target.value)); setPage(1); }}
                    className="px-3 py-1 border rounded-md"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded-md border ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.max(1, Math.ceil(total / perPage)) }).slice(Math.max(0, page - 3), Math.min(Math.ceil(total / perPage), page + 2)).map((_, idx) => {
                      const pageNumber = Math.max(1, Math.min(Math.ceil(total / perPage), page - 2)) + idx;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`px-3 py-1 rounded-md border ${page === pageNumber ? 'bg-purple-600 text-white' : ''}`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * perPage >= total}
                    className={`px-3 py-1 rounded-md border ${page * perPage >= total ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && products.length > 0 && (
          <div className="mt-6">
            <ErrorMessage message={error} />
          </div>
        )}
      </div>
    </div>
  );
}

