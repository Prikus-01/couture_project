import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import InventoryOverview from './InventoryOverview';

export default function CatalogueOverview() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const cats = await api.getCategories();
        setCategories(cats);

        // Fetch a sample product from each category for preview
        const productsMap: Record<string, Product[]> = {};
        await Promise.all(
          cats.map(async (cat) => {
            try {
              const data = await api.getProductsByCategory(cat, 1);
              productsMap[cat] = data.products;
            } catch (err) {
              // Ignore errors for individual categories
              productsMap[cat] = [];
            }
          })
        );
        setCategoryProducts(productsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // If a category is selected, show the inventory view filtered by that category
  if (category) {
    return <InventoryOverview />;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
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
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Catalogue Overview
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Browse products by category. Click on a category to view all products in that category.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const previewProduct = categoryProducts[cat]?.[0];
            return (
              <button
                key={cat}
                onClick={() => navigate(`/catalogue?category=${encodeURIComponent(cat)}`)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden text-left border-2 border-transparent hover:border-purple-300 transform hover:-translate-y-2"
              >
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  {previewProduct ? (
                    <img
                      src={previewProduct.thumbnail}
                      alt={previewProduct.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-purple-50">
                      <svg
                        className="w-20 h-20 text-purple-300 group-hover:text-purple-400 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-5 relative">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all mb-2">
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
                  </h3>
                  {previewProduct && (
                    <p className="text-sm text-gray-500 truncate">
                      {previewProduct.title}
                    </p>
                  )}
                  <div className="mt-3 flex items-center text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">Explore</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

