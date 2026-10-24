import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, ChevronDown, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const [showFilters, setShowFilters] = useState(false);

  let filteredProducts = [...products];

  // Filter by search
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter by category
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  // Filter by price
  filteredProducts = filteredProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  // Sort
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'discount':
      filteredProducts.sort((a, b) => b.discount - a.discount);
      break;
  }

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 200000]);
    setSortBy('featured');
  };

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-surface-900">
            {searchQuery ? `Results for "${searchQuery}"` : selectedCategory || 'All Products'}
          </h1>
          <p className="text-sm text-surface-500 mt-1">{filteredProducts.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sort & Filter Bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-surface-300 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <SlidersHorizontal className="w-4 h-4 text-surface-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-surface-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`
            fixed lg:static inset-0 z-40 lg:z-auto bg-white lg:bg-transparent
            w-72 lg:w-56 flex-shrink-0 p-6 lg:p-0 overflow-y-auto
            transform transition-transform duration-300 lg:transform-none
            ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-surface-900 mb-3 text-sm">Category</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block text-sm w-full text-left py-1.5 px-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-primary-50 text-primary-600 font-medium' : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  All Categories
                </button>
                {uniqueCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block text-sm w-full text-left py-1.5 px-2 rounded-lg transition-colors ${
                      selectedCategory === cat ? 'bg-primary-50 text-primary-600 font-medium' : 'text-surface-600 hover:bg-surface-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold text-surface-900 mb-3 text-sm">Price Range</h4>
              <div className="space-y-2">
                {[
                  [0, 5000, 'Under ₹5,000'],
                  [5000, 15000, '₹5,000 - ₹15,000'],
                  [15000, 50000, '₹15,000 - ₹50,000'],
                  [50000, 200000, '₹50,000+'],
                ].map(([min, max, label]) => (
                  <button
                    key={label}
                    onClick={() => setPriceRange([min, max])}
                    className={`block text-sm w-full text-left py-1.5 px-2 rounded-lg transition-colors ${
                      priceRange[0] === min && priceRange[1] === max
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-surface-600 hover:bg-surface-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {(selectedCategory || priceRange[0] > 0 || priceRange[1] < 200000) && (
              <button onClick={clearFilters} className="text-sm text-primary-500 font-semibold hover:text-primary-600">
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Overlay */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setShowFilters(false)} />
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold text-surface-900 mb-2">No products found</h3>
                <p className="text-surface-500 text-sm mb-4">Try adjusting your filters or search.</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
