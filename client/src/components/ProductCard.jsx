import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="card group overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-surface-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-surface-900 text-sm md:text-base group-hover:text-primary-500 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-surface-500 mt-0.5">{product.brand}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded">
            <Star className="w-3 h-3 text-green-600 fill-green-600" />
            <span className="text-xs font-semibold text-green-700">{product.rating}</span>
          </div>
          <span className="text-xs text-surface-400">({product.reviews?.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-lg font-bold text-surface-900">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-surface-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
          {product.discount > 0 && (
            <span className="badge-discount">{product.discount}% OFF</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-surface-200 hover:border-primary-500 hover:bg-primary-500 hover:text-white text-surface-700 rounded-lg text-sm font-semibold transition-all duration-300 group/btn"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
