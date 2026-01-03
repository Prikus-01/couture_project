import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  showDetails?: boolean;
}

export default function ProductCard({ product, showDetails = false }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-green-600 font-medium">
              {product.discountPercentage.toFixed(0)}% off
            </span>
          )}
        </div>
        {showDetails && (
          <div className="mt-2 text-sm text-gray-600">
            <p className="truncate">{product.brand}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500">★</span>
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

