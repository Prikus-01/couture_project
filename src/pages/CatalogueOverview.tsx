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
        {/* Decorative background elements */}
        <div className="fixed top-20 right-10 w-72 h-72 bg-[#5cacfa]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-20 left-10 w-96 h-96 bg-[#2c8cfb]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-12 relative">
          <h1 className="text-[44px] md:text-5xl font-bold text-[#2c4c71] mb-3.5 tracking-tight">
            Catalogue Overview
          </h1>
          <p className="text-[17px] text-[#5c6468] max-w-2xl mx-auto leading-relaxed">
            Browse products by category. Click on a category to view all products in that category.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 relative">
          {categories.map((cat) => {
            const previewProduct = categoryProducts[cat]?.[0];
            return (
              <button
                key={cat}
                onClick={() => navigate(`/catalogue?category=${encodeURIComponent(cat)}`)}
                className="group relative bg-white rounded-[14px] shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden text-left border-2 border-transparent hover:border-[#5cacfa]/50 transform hover:-translate-y-2"
              >
                {/* Decorative linear overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-[#2c8cfb]/0 via-transparent to-[#5cacfa]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Image Section */}
                <div className="relative h-52 bg-linear-to-br from-[#446285] to-[#2c4c71] overflow-hidden">
                  {previewProduct ? (
                    <img
                      src={previewProduct.thumbnail}
                      alt={cat}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-20 h-20 text-[#a5b8cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 relative">
                  <h3 className="text-[22px] font-semibold text-[#2c4c71] mb-2.5 group-hover:text-[#2c8cfb] transition-colors">
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
                  </h3>
                  {previewProduct && (
                    <p className="text-[14px] text-[#5c6468] mb-4 line-clamp-2 leading-relaxed">
                      {previewProduct.title}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#2c8cfb] group-hover:gap-3 transition-all">
                    Explore
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}