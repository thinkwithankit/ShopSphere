import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartTotal, cartMRP, cartDiscount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-surface-400" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Your cart is empty</h2>
        <p className="text-surface-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-surface-900 mb-6">
        Shopping Cart ({cartCount})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="card p-4 md:p-5 flex gap-4 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              {/* Image */}
              <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link to={`/product/${item.id}`} className="font-semibold text-surface-900 hover:text-primary-500 transition-colors text-sm md:text-base line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {item.brand}
                      {item.selectedColor && ` · ${item.selectedStorage || ''}`}
                    </p>
                  </div>
                  <span className="font-bold text-surface-900 whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>

                {/* Color & Size Info */}
                <div className="flex items-center gap-3 mt-2">
                  {item.selectedColor && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full border border-surface-300" style={{ backgroundColor: item.selectedColor }} />
                    </div>
                  )}
                  {item.selectedStorage && (
                    <span className="text-xs bg-surface-100 px-2 py-0.5 rounded text-surface-600">{item.selectedStorage}</span>
                  )}
                </div>

                {/* Quantity & Remove */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-surface-300 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(index, item.quantity - 1)} className="p-1.5 hover:bg-surface-100 transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, item.quantity + 1)} className="p-1.5 hover:bg-surface-100 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="text-surface-400 hover:text-red-500 p-1 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 md:p-6 sticky top-28">
            <h3 className="font-bold text-surface-900 text-lg mb-4">Price Details</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-surface-600">
                <span>Total MRP</span>
                <span>₹{cartMRP.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{cartDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-surface-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
            </div>

            <div className="border-t border-surface-200 mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg text-surface-900">
                <span>Total Amount</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full mt-5 py-3 text-center block">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="block text-center text-sm text-primary-500 font-semibold mt-3 hover:text-primary-600 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
