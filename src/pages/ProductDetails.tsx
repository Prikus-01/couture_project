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

function formatDimensions(dims?: Product['dimensions']) {
  if (!dims) return '—';
  const parts: string[] = [];
  if (typeof dims.width !== 'undefined') parts.push(`W: ${dims.width}`);
  if (typeof dims.height !== 'undefined') parts.push(`H: ${dims.height}`);
  if (typeof dims.depth !== 'undefined') parts.push(`D: ${dims.depth}`);
  return parts.join(' × ') || '—';
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <ErrorMessage message={error || 'Product not found'} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  const discountPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/inventory" className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors group">
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Inventory
          </Link>
        </nav>

        {/* Main Product Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-purple-100 mb-12">
          <div className="p-6 md:p-8 space-y-8">
            {/* Top hero image */}
            <div className="w-full rounded-2xl overflow-hidden bg-gray-50 shadow-lg">
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                className="w-full h-[48vh] md:h-[64vh] object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto">
              {product.images.length ? (
                product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all transform hover:scale-105 ${
                      selectedImage === index
                        ? 'border-purple-500 ring-2 ring-purple-200 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <img src={image} alt={`${product.title} view ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))
              ) : (
                <div className="p-6 text-gray-500">No images available</div>
              )}
            </div>

            {/* Details section below image */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main info */}
              <div className="md:col-span-2">
                <div className="mb-2">
                  <span className="inline-block px-4 py-2 bg-purple-500 text-white text-sm font-bold rounded-full mb-4 shadow-sm">
                    {product.category ? (product.category.charAt(0).toUpperCase() + product.category.slice(1).replace(/-/g, ' ')) : 'Uncategorized'}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{product.title}</h1>
                  <p className="text-lg text-gray-600">{product.brand}</p>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-2">⭐</span>
                      <span className="font-semibold">{product.rating.toFixed(1)}</span>
                      <span className="ml-2 text-sm text-gray-500">({product.reviews?.length ?? '0'} reviews)</span>
                    </div>

                    <div className="ml-4">
                      <span className={`px-3 py-1 rounded-full font-semibold text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900">${discountPrice.toFixed(2)}</div>
                    {product.discountPercentage > 0 && <div className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</div>}
                    {product.discountPercentage > 0 && <div className="mt-2 px-3 py-1 inline-block text-sm font-semibold bg-orange-400 text-white rounded-xl">{product.discountPercentage.toFixed(0)}% OFF</div>}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 p-6 bg-white rounded-lg border">
                  <h2 className="text-xl font-bold mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Reviews */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3">Customer Reviews</h3>
                  {product.reviews && product.reviews.length ? (
                    <div className="space-y-4">
                      {product.reviews.map((r: Review, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-gray-50 border">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{r.reviewerName ?? 'Anonymous'}</div>
                              <div className="text-xs text-gray-500">{r.reviewerEmail}</div>
                            </div>
                            <div className="text-sm font-semibold">{r.rating} / 5</div>
                          </div>
                          <div className="mt-2 text-gray-700">{r.comment}</div>
                          <div className="mt-2 text-xs text-gray-400">{formatDate(r.date)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No reviews yet</div>
                  )}
                </div>
              </div>

              {/* Side panel with quick facts */}
              <aside className="p-4 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-500">SKU</div>
                <div className="font-medium mb-3">{product.sku ?? '—'}</div>

                <div className="text-xs text-gray-500">Weight</div>
                <div className="font-medium mb-3">{product.weight ? `${product.weight}` : '—'}</div>

                <div className="text-xs text-gray-500">Dimensions</div>
                <div className="font-medium mb-3">{formatDimensions(product.dimensions)}</div>

                <div className="text-xs text-gray-500">Minimum Order</div>
                <div className="font-medium mb-3">{product.minimumOrderQuantity ?? '—'}</div>

                <div className="text-xs text-gray-500">Availability</div>
                <div className="font-medium mb-3">{product.availabilityStatus ?? '—'}</div>

                <div className="text-xs text-gray-500">Warranty</div>
                <div className="font-medium mb-3">{product.warrantyInformation ?? '—'}</div>

                <div className="text-xs text-gray-500">Shipping</div>
                <div className="font-medium mb-3">{product.shippingInformation ?? '—'}</div>

                <div className="text-xs text-gray-500">Return Policy</div>
                <div className="font-medium mb-3">{product.returnPolicy ?? '—'}</div>

                <div className="text-xs text-gray-500">Created</div>
                <div className="font-medium mb-1">{formatDate(product.meta?.createdAt)}</div>
                <div className="text-xs text-gray-500">Updated</div>
                <div className="font-medium">{formatDate(product.meta?.updatedAt)}</div>

                <div className="mt-4 text-xs text-gray-500">Barcode</div>
                <div className="font-medium">{product.meta?.barcode ?? '—'}</div>

                <div className="mt-4 text-xs text-gray-500">Deleted</div>
                <div className="font-medium">{product.isDeleted ? `Yes (${formatDate(product.deletedOn)})` : 'No'}</div>
              </aside>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <div className="mb-8 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Browse Similar Products</span>
              </h2>
              <p className="text-lg text-gray-600">Discover more products from this category</p>
            </div>
            {similarLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard key={similarProduct.id} product={similarProduct} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

