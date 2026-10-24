import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Smartphone, Banknote, Plus, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, setIsLoginOpen } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address] = useState({
    name: user?.name || 'Ankit Patel',
    address: '123, Green Park, Panipat, Haryana - 132103',
    phone: '+91 98765-43210',
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-surface-900 mb-4">Please login to continue</h2>
        <button onClick={() => setIsLoginOpen(true)} className="btn-primary">Login / Sign Up</button>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-surface-900 mb-4">Your cart is empty</h2>
        <Link to="/products" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-scale-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Order Placed Successfully!</h2>
        <p className="text-surface-500 mb-2">Thank you for your purchase.</p>
        <p className="text-sm text-surface-400 mb-6">Order ID: #ORD-{Date.now().toString().slice(-6)}</p>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard" className="btn-primary">View Orders</Link>
          <Link to="/" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  const paymentOptions = [
    { id: 'upi', label: 'UPI (PhonePe, Google Pay, Paytm)', icon: Smartphone },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-500 mb-6">
        <Link to="/cart" className="hover:text-primary-500">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-surface-900 font-medium">Checkout</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-surface-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-500" />
              <h2 className="font-bold text-surface-900 text-lg">Shipping Address</h2>
            </div>

            <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 flex items-start justify-between">
              <div>
                <p className="font-semibold text-surface-900">{address.name}</p>
                <p className="text-sm text-surface-500 mt-1">{address.address}</p>
                <p className="text-sm text-surface-500">{address.phone}</p>
              </div>
              <button className="text-primary-500 text-sm font-semibold hover:text-primary-600 transition-colors">
                Change
              </button>
            </div>

            <button className="flex items-center gap-2 text-primary-500 text-sm font-semibold mt-4 hover:text-primary-600 transition-colors">
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          </div>

          {/* Payment Method */}
          <div className="card p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary-500" />
              <h2 className="font-bold text-surface-900 text-lg">Payment Method</h2>
            </div>

            <div className="space-y-3">
              {paymentOptions.map(option => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === option.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                    className="w-4 h-4 text-primary-500 accent-primary-500"
                  />
                  <span className="flex-1 text-sm font-medium text-surface-700">{option.label}</span>
                  <option.icon className="w-5 h-5 text-surface-400" />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 md:p-6 sticky top-28">
            <h3 className="font-bold text-surface-900 text-lg mb-4">Order Summary</h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-surface-900 whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-surface-200 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-surface-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-surface-900 pt-2 border-t border-surface-200">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} className="btn-primary w-full mt-5 py-3 text-center">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
