import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-surface-400" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Your wishlist is empty</h2>
        <p className="text-surface-500 mb-6">Save items you love to your wishlist.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-surface-900 mb-6">
        My Wishlist ({wishlist.length})
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((product, i) => (
          <div key={product.id} className="card overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-surface-50 aspect-square">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                  {product.discount}% OFF
                </span>
              )}
            </Link>

            <div className="p-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold text-surface-900 text-sm hover:text-primary-500 transition-colors line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-surface-500 mt-0.5">{product.brand}</p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-surface-900">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-sm text-surface-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2.5 border border-surface-300 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
