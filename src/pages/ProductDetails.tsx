import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Product, Review } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProductCard from '../components/ProductCard';

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await api.getProduct(parseInt(id));
        setProduct(productData);
        setSelectedImage(0);

        // Fetch similar products from same category
        setSimilarLoading(true);
        const similarData = await api.getProductsByCategory(productData.category, 7);
        const filtered = similarData.products.filter((p) => p.id !== productData.id);
        setSimilarProducts(filtered.slice(0, 6));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
        setSimilarLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <ErrorMessage message={error || 'Product not found'} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const discountPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-5">
      <div className="container mx-auto max-w-7xl">
        {/* Decorative background elements */}
        <div className="fixed top-20 right-10 w-80 h-80 bg-[#5cacfa]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-20 left-10 w-96 h-96 bg-[#2c8cfb]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Breadcrumb */}
        <Link
          to="/inventory"
          className="inline-flex items-center gap-2 text-[15px] font-medium text-[#446285] hover:text-[#2c8cfb] mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Inventory
        </Link>

        {/* Main Product Card */}
        <div className="bg-white rounded-[14px] shadow-xl overflow-hidden mb-10 border border-[#a5b8cc]/20">
          {/* Top hero image */}
          <div className="relative h-[420px] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden border-b border-[#a5b8cc]/20">
            {product.images && product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="max-w-full max-h-full object-contain p-8"
              />
            ) : (
              <div className="text-[#a5b8cc] flex flex-col items-center gap-3">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[15px]">No image available</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 p-5 overflow-x-auto bg-[#a5b8cc]/6 border-t border-[#a5b8cc]/20">
            {product.images.length ? (
              product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 h-[76px] w-[76px] rounded-[10px] overflow-hidden border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
                    selectedImage === index
                      ? 'border-[#2c8cfb] ring-2 ring-[#2c8cfb]/20 shadow-md'
                      : 'border-[#a5b8cc]/30 hover:border-[#5cacfa]'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="text-[15px] text-[#5c6468] py-4">
                No images available
              </div>
            )}
          </div>

          {/* Details section below image */}
          <div className="p-8">
            {/* Category Badge */}
            <span className="inline-block px-3.5 py-1.5 bg-[#5cacfa]/15 text-[#2c4c71] rounded-[6px] text-[13px] font-semibold uppercase tracking-wide mb-3.5 border border-[#5cacfa]/30">
              {product.category ? (product.category.charAt(0).toUpperCase() + product.category.slice(1).replace(/-/g, ' ')) : 'Uncategorized'}
            </span>

            {/* Title */}
            <h1 className="text-[36px] md:text-[42px] font-bold text-[#2c4c71] mb-2.5 leading-tight">
              {product.title}
            </h1>

            {/* Brand */}
            <p className="text-[17px] text-[#5c6468] mb-5">
              {product.brand}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-[#2c8cfb]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[18px] font-semibold text-[#2c4c71]">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-[15px] text-[#5c6468]">
                ({product.reviews?.length ?? '0'} reviews)
              </span>
            </div>

            {/* Stock Badge */}
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-[8px] text-[15px] font-semibold ${
                product.stock > 0 
                  ? 'bg-[#5cacfa]/20 text-[#2c4c71] border border-[#5cacfa]/40' 
                  : 'bg-[#446285]/20 text-[#2c4c71] border border-[#446285]/40'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <p className="text-[34px] font-bold text-[#2c8cfb] mb-1.5 tabular-nums">
                ${discountPrice.toFixed(2)}
              </p>
              <div className="flex items-center gap-3">
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-[18px] text-[#a5b8cc] line-through tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="px-2.5 py-1 bg-[#2c8cfb]/15 text-[#2c8cfb] rounded-[6px] text-[14px] font-semibold">
                      {product.discountPercentage.toFixed(0)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>
            {/* Description */}
            <div className="mb-8 pb-8 border-b-2 border-[#a5b8cc]/25">
              <h2 className="text-[22px] font-semibold text-[#2c4c71] mb-4">
                Description
              </h2>
              <p className="text-[16px] text-[#5c6468] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-[22px] font-semibold text-[#2c4c71] mb-5">
                Customer Reviews
              </h2>
              {product.reviews && product.reviews.length ? (
                <div className="space-y-5">
                  {product.reviews.map((r: Review, idx) => (
                    <div
                      key={idx}
                      className="bg-[#a5b8cc]/8 border border-[#a5b8cc]/20 rounded-[10px] p-5 hover:border-[#5cacfa]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-[16px] font-semibold text-[#2c4c71] mb-1">
                            {r.reviewerName ?? 'Anonymous'}
                          </h4>
                          <p className="text-[13px] text-[#a5b8cc]">
                            {r.reviewerEmail}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2c8cfb]/10 rounded-[6px] border border-[#2c8cfb]/20">
                          <svg className="w-4 h-4 text-[#2c8cfb]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-[14px] font-semibold text-[#2c8cfb]">
                            {r.rating} / 5
                          </span>
                        </div>
                      </div>
                      <p className="text-[15px] text-[#5c6468] leading-relaxed mb-2.5">
                        {r.comment}
                      </p>
                      <p className="text-[13px] text-[#a5b8cc]">
                        {formatDate(r.date)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#a5b8cc]/6 rounded-[10px] border border-[#a5b8cc]/20">
                  <svg className="w-16 h-16 text-[#a5b8cc] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="text-[15px] text-[#5c6468]">
                    No reviews yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="bg-white rounded-[14px] p-9 shadow-md border border-[#a5b8cc]/20">
            <div className="mb-8">
              <h2 className="text-[28px] font-semibold text-[#2c4c71] mb-2">
                Browse Similar Products
              </h2>
              <p className="text-[16px] text-[#5c6468]">
                Discover more products from this category
              </p>
            </div>

            {similarLoading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard key={similarProduct.id} product={similarProduct} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}