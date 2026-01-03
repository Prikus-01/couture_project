import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProductCard from '../components/ProductCard';

export default function InventoryOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categories (fetched separately so the dropdown always contains all categories)
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const [sortBy, setSortBy] = useState<'name' | 'price' | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 20;

  // Fetch categories once (so dropdown contains all categories regardless of current page)
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const cats = await api.getCategories();
        setCategories(cats || []);
      } catch (err) {
        setCategoriesError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Keep selected category in sync with URL param
  useEffect(() => {
    setSelectedCategory(categoryFilter || '');
    setPage(1);
  }, [categoryFilter]);

  // Fetch products depending on page, selectedCategory and search term
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const skip = (page - 1) * perPage;

        if (searchTerm) {
          // Use the search endpoint whenever user searches; fetch a large limit and then paginate/filter client-side
          const res = await api.searchProducts(searchTerm, 1000, 0);
          let items = res.products || [];
          if (selectedCategory) {
            items = items.filter((p) => p.category === selectedCategory);
          }
          setProducts(items);
          setFilteredProducts(items);
          setTotalCount(items.length);
        } else if (selectedCategory) {
          const data = await api.getProductsByCategory(selectedCategory, perPage, skip);
          setProducts(data.products);
          setFilteredProducts(data.products);
          setTotalCount(data.total ?? data.products.length);
        } else {
          const data = await api.getProducts(skip, perPage);
          setProducts(data.products);
          setFilteredProducts(data.products);
          setTotalCount(data.total ?? data.products.length);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategory, searchTerm]);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    let filtered = [...products];

    // Search filter (applies when server-side search isn't used or for extra safety)
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (in case products were fetched without category)
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sorting
    if (sortBy === 'name') {
      filtered.sort((a, b) =>
        sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );
    } else if (sortBy === 'price') {
      filtered.sort((a, b) =>
        sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, sortOrder, products]);



  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const paginatedProducts = searchTerm ? filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  ) : filteredProducts;

  const getStockStatus = (stock: number) => {
    if (stock > 50) return { label: 'In Stock', color: 'bg-[#5cacfa]/20 text-[#2c4c71] border border-[#5cacfa]/30' };
    if (stock > 0) return { label: 'Low Stock', color: 'bg-[#a5b8cc]/25 text-[#446285] border border-[#a5b8cc]/40' };
    return { label: 'Out of Stock', color: 'bg-[#446285]/15 text-[#2c4c71] border border-[#446285]/30' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-10 px-5">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[40px] md:text-5xl font-bold text-[#2c4c71] mb-2.5 tracking-tight">
            {selectedCategory
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`
              : 'Inventory Overview'}
          </h1>
          <p className="text-[16px] text-[#5c6468] leading-relaxed">
            Manage and browse your product inventory
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 mb-7 shadow-md border border-[#a5b8cc]/25">
          {/* Search */}
          <div className="relative mb-4.5">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a5b8cc]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-[1.5px] border-[#a5b8cc] rounded-[10px] text-[15px] text-[#2c4c71] placeholder-[#a5b8cc] focus:outline-none focus:border-[#2c8cfb] focus:ring-3 focus:ring-[#2c8cfb]/10 transition-all duration-200"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3.5 items-center">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(val);
                setPage(1);
                // sync to URL
                if (val) setSearchParams({ category: val });
                else setSearchParams({});
              }}
              className="px-3.5 py-2.5 border-[1.5px] border-[#a5b8cc] rounded-[9px] text-[15px] text-[#446285] bg-white hover:border-[#5cacfa] hover:bg-slate-50 focus:outline-none focus:border-[#2c8cfb] focus:ring-3 focus:ring-[#2c8cfb]/10 transition-all duration-200 cursor-pointer"
              disabled={categoriesLoading}
            >
              {categoriesLoading ? (
                <option value="">Loading categories...</option>
              ) : categoriesError ? (
                <>
                  <option value="">All Categories</option>
                  <option value="">Failed to load categories</option>
                </>
              ) : (
                <>
                  <option value="">All Categories</option>
                  {categories.slice().sort().map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
                    </option>
                  ))}
                </>
              )}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | '')}
              className="px-3.5 py-2.5 border-[1.5px] border-[#a5b8cc] rounded-[9px] text-[15px] text-[#446285] bg-white hover:border-[#5cacfa] hover:bg-slate-50 focus:outline-none focus:border-[#2c8cfb] focus:ring-3 focus:ring-[#2c8cfb]/10 transition-all duration-200 cursor-pointer"
            >
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>

            {/* Sort Order */}
            {sortBy && (
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2.5 border-[1.5px] border-[#a5b8cc] rounded-lg bg-white text-[#446285] hover:border-[#5cacfa] hover:bg-[#5cacfa]/10 transition-all duration-200"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                )}
              </button>
            )}

            {/* View Toggle */}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 border-[1.5px] rounded-lg transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-[#2c8cfb]/15 border-[#2c8cfb] text-[#2c8cfb]'
                    : 'bg-white border-[#a5b8cc] text-[#446285] hover:border-[#5cacfa] hover:bg-[#5cacfa]/10'
                }`}
                title="Table View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 border-[1.5px] rounded-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-[#2c8cfb]/15 border-[#2c8cfb] text-[#2c8cfb]'
                    : 'bg-white border-[#a5b8cc] text-[#446285] hover:border-[#5cacfa] hover:bg-[#5cacfa]/10'
                }`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-5 text-[15px] text-[#5c6468] font-medium">
          Showing {paginatedProducts.length} of {totalCount} products
        </div>
        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#a5b8cc]/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-[#446285] to-[#2c4c71] border-b-2 border-[#5cacfa]/30">
                  <tr>
                    <th className="px-5 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-5 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-5 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-5 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-5 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-5 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-[15px] text-[#5c6468]">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product, index) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <tr
                          key={product.id}
                          className={`border-b border-[#a5b8cc]/25 hover:bg-[#5cacfa]/6 transition-colors duration-150 ${
                            index % 2 === 1 ? 'bg-[#a5b8cc]/4' : ''
                          }`}
                        >
                          <td className="px-5 py-4">
                            <Link
                              to={`/product/${product.id}`}
                              className="flex items-center gap-3.5 group"
                            >
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-12 h-12 object-cover rounded-lg border border-[#a5b8cc]/30 group-hover:border-[#5cacfa] transition-colors"
                              />
                              <div className="flex flex-col">
                                <span className="font-medium text-[15px] text-[#2c4c71] group-hover:text-[#2c8cfb] transition-colors line-clamp-1">
                                  {product.title}
                                </span>
                                {product.rating && (
                                  <span className="text-[13px] text-[#5c6468] flex items-center gap-1">
                                    ⭐ {product.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-[15px] text-[#5c6468]">
                            {product.brand}
                          </td>
                          <td className="px-5 py-4 text-[15px] text-[#5c6468]">
                            {product.category}
                          </td>
                          <td className="px-5 py-4 text-[15px] font-semibold text-[#2c4c71] tabular-nums">
                            ${product.price.toFixed(2)}
                            {product.discountPercentage > 0 && (
                              <span className="ml-2 text-[12px] font-semibold px-2 py-0.5 bg-[#2c8cfb]/15 text-[#2c8cfb] rounded-[5px]">
                                {product.discountPercentage.toFixed(0)}% off
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-[15px] font-medium text-[#2c4c71] tabular-nums">
                            {product.stock} units
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-block px-3 py-1.5 rounded-md text-[13px] font-semibold ${stockStatus.color}`}>
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
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.length === 0 ? (
              <div className="col-span-full text-center py-16 text-[15px] text-[#5c6468]">
                No products found
              </div>
            ) : (
              paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4.5 py-2.5 border-[1.5px] border-[#a5b8cc] rounded-lg bg-white text-[#446285] font-medium text-[15px] hover:border-[#2c8cfb] hover:bg-[#2c8cfb]/6 hover:text-[#2c8cfb] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#a5b8cc] disabled:hover:bg-white disabled:hover:text-[#446285] transition-all duration-200"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-[15px] text-[#5c6468] font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4.5 py-2.5 border-[1.5px] border-[#a5b8cc] rounded-lg bg-white text-[#446285] font-medium text-[15px] hover:border-[#2c8cfb] hover:bg-[#2c8cfb]/6 hover:text-[#2c8cfb] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#a5b8cc] disabled:hover:bg-white disabled:hover:text-[#446285] transition-all duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}