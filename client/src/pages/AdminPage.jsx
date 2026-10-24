import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings, LogOut,
  TrendingUp, TrendingDown, DollarSign, Eye, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { adminOrders, products } from '../data/products';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const stats = [
    { label: 'Total Revenue', value: '₹4,25,680', change: '+17%', up: true, icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Products', value: '1,248', change: '+5%', up: true, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: '12', change: '+9%', up: true, icon: Package, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Users', value: '1,248', change: '+3%', up: true, icon: Users, color: 'bg-amber-50 text-amber-600' },
  ];

  const sideLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Products', icon: ShoppingBag },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'categories', name: 'Categories', icon: BarChart3 },
    { id: 'reports', name: 'Reports', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  // Sales data for chart visualization
  const salesData = [
    { month: 'May', value: 65 },
    { month: 'Jun', value: 78 },
    { month: 'Jul', value: 55 },
    { month: 'Aug', value: 90 },
    { month: 'Sep', value: 72 },
    { month: 'Oct', value: 85 },
  ];
  const maxSales = Math.max(...salesData.map(d => d.value));

  return (
    <div className="min-h-screen bg-surface-50 animate-fade-in">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-surface-900 text-white min-h-screen sticky top-0">
          <div className="p-5 border-b border-surface-700">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold">Admin Panel</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sideLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === link.id
                    ? 'bg-primary-500 text-white'
                    : 'text-surface-400 hover:bg-surface-800 hover:text-white'
                }`}
              >
                <link.icon className="w-4.5 h-4.5" />
                {link.name}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-surface-700">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4.5 h-4.5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="bg-white border-b border-surface-200 sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-xl font-bold text-surface-900 capitalize">{activeTab}</h1>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600">{user.name.charAt(0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Overview */}
              <div className="card p-5">
                <h3 className="font-bold text-surface-900 mb-4">Sales Overview</h3>
                <div className="flex items-end gap-3 h-48">
                  {salesData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-surface-500 font-medium">₹{d.value}k</span>
                      <div
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-500 hover:from-primary-600 hover:to-primary-500"
                        style={{ height: `${(d.value / maxSales) * 100}%`, minHeight: '20px' }}
                      />
                      <span className="text-xs text-surface-500">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-surface-200">
                  <h3 className="font-bold text-surface-900">Recent Orders</h3>
                  <button className="text-primary-500 text-sm font-semibold">View All</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-surface-600">Order</th>
                        <th className="text-left py-3 px-4 font-semibold text-surface-600">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-surface-600">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-surface-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {adminOrders.map((order, i) => (
                        <tr key={i} className="hover:bg-surface-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-surface-900">{order.id}</td>
                          <td className="py-3 px-4 text-surface-600">{order.customer}</td>
                          <td className="py-3 px-4 font-semibold text-surface-900">₹{order.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.statusColor}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Products Management (when products tab) */}
            {activeTab === 'products' && (
              <div className="mt-6">
                <div className="card overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-surface-200">
                    <h3 className="font-bold text-surface-900">All Products</h3>
                    <button className="btn-primary text-sm py-2">+ Add Product</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-surface-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-surface-600">Product</th>
                          <th className="text-left py-3 px-4 font-semibold text-surface-600">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-surface-600">Price</th>
                          <th className="text-left py-3 px-4 font-semibold text-surface-600">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-surface-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100">
                        {products.map((p, i) => (
                          <tr key={i} className="hover:bg-surface-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                <span className="font-medium text-surface-900">{p.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-surface-600">{p.category}</td>
                            <td className="py-3 px-4 font-semibold">₹{p.price.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">Active</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="text-xs text-primary-500 font-semibold hover:text-primary-600">Edit</button>
                                <button className="text-xs text-red-500 font-semibold hover:text-red-600">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
