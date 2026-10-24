import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Heart, Settings, LogOut, ShoppingBag, Clock, TrendingUp } from 'lucide-react';
import { orders } from '../data/products';
import { useWishlist } from '../context/WishlistContext';

export default function DashboardPage() {
  const { user, logout, setIsLoginOpen } = useAuth();
  const { wishlist } = useWishlist();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-surface-900 mb-4">Please login to view your dashboard</h2>
        <button onClick={() => setIsLoginOpen(true)} className="btn-primary">Login / Sign Up</button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Orders', value: '5', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending', value: '3', icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Total Spent', value: '₹1,45,000', icon: TrendingUp, color: 'bg-green-50 text-green-600' },
  ];

  const sideLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'My Orders', icon: Package },
    { name: 'Wishlist', icon: Heart },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-5">
            {/* Profile */}
            <div className="text-center mb-5 pb-5 border-b border-surface-200">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-primary-600">{user.name.charAt(0)}</span>
              </div>
              <h3 className="font-semibold text-surface-900">{user.name}</h3>
              <p className="text-xs text-surface-500">{user.email}</p>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {sideLinks.map(link => (
                <button
                  key={link.name}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    link.active
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  <link.icon className="w-4.5 h-4.5" />
                  {link.name}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4.5 h-4.5" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Welcome */}
          <div className="card p-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
            <h2 className="text-xl md:text-2xl font-bold">Welcome, {user.name.split(' ')[0]} 👋</h2>
            <p className="text-primary-100 text-sm mt-1">Here's what's happening with your account.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                  <p className="text-xs text-surface-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-surface-200">
              <h3 className="font-bold text-surface-900 text-lg">Recent Orders</h3>
              <Link to="/products" className="text-primary-500 text-sm font-semibold hover:text-primary-600">View All →</Link>
            </div>

            <div className="divide-y divide-surface-100">
              {orders.map((order, i) => (
                <div key={i} className="flex items-center gap-4 p-5 hover:bg-surface-50 transition-colors">
                  <img src={order.image} alt={order.product} className="w-14 h-14 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-surface-900 text-sm line-clamp-1">{order.product}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-surface-900 text-sm">₹{order.price.toLocaleString()}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
