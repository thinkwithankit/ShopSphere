import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Menu, X, ChevronDown, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { user, logout, setIsLoginOpen } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const accountRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Deals', path: '/deals' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-surface-200 shadow-sm">
      {/* Top bar */}
      <div className="bg-primary-500 text-white text-center py-1.5 text-sm font-medium">
        🎉 Free shipping on orders above ₹999 | Use code <span className="font-bold">SHOP10</span> for 10% off
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-surface-900">
              Shop<span className="text-primary-500">Sphere</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 ml-8">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} className="nav-link text-sm">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full pl-4 pr-12 py-2.5 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-surface-50"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Account Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => user ? setIsAccountOpen(!isAccountOpen) : setIsLoginOpen(true)}
                className="hidden sm:flex items-center gap-1.5 nav-link text-sm"
              >
                <User className="w-5 h-5" />
                <span className="hidden lg:inline">
                  {user ? user.name.split(' ')[0] : 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 hidden lg:block" />
              </button>

              {isAccountOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-surface-200 py-2 animate-slide-down z-50">
                  <div className="px-4 py-3 border-b border-surface-100">
                    <p className="font-semibold text-surface-900 text-sm">{user.name}</p>
                    <p className="text-xs text-surface-500">{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { logout(); setIsAccountOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 nav-link">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 nav-link">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 nav-link">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-4 pr-12 py-2.5 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-surface-50"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary-500 text-white p-2 rounded-lg">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-surface-200 animate-slide-down">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="py-2.5 px-4 text-surface-700 hover:bg-surface-50 rounded-lg font-medium text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => { setIsMenuOpen(false); setIsLoginOpen(true); }}
                className="py-2.5 px-4 text-primary-500 hover:bg-primary-50 rounded-lg font-medium text-sm text-left transition-colors"
              >
                Login / Sign Up
              </button>
            )}
            {user && (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="py-2.5 px-4 text-surface-700 hover:bg-surface-50 rounded-lg font-medium text-sm transition-colors">
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="py-2.5 px-4 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm text-left transition-colors">
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
