import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Monitor, Shirt, Home, Sparkles, Dumbbell, BookOpen, Gamepad2, LayoutGrid, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories, heroSlides } from '../data/products';

const iconMap = { Monitor, Shirt, Home, Sparkles, Dumbbell, BookOpen, Gamepad2, LayoutGrid };

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On all orders above ₹999' },
    { icon: Shield, title: 'Secure Payment', desc: '100% safe & secure' },
    { icon: RotateCcw, title: 'Easy Returns', desc: 'Hassle free returns' },
    { icon: Headphones, title: '24/7 Support', desc: "We're here to help" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-surface-50 to-surface-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative min-h-[320px] md:min-h-[420px] lg:min-h-[480px] flex items-center">
            {heroSlides.map((slide, i) => (
              <div
                key={slide.id}
                className={`absolute inset-0 flex flex-col md:flex-row items-center transition-all duration-700 ${
                  i === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="flex-1 py-8 md:py-0 z-10">
                  <span className="inline-block bg-primary-100 text-primary-600 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full mb-3 md:mb-4">
                    {slide.badge}
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 leading-tight mb-3 md:mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base text-surface-500 mb-4 md:mb-6 max-w-md">
                    {slide.subtitle}
                  </p>
                  <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                    {slide.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex-1 relative hidden md:block">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-[350px] lg:h-[420px] object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            ))}

            {/* Slide Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'bg-primary-500 w-7' : 'bg-surface-300'
                  }`}
                />
              ))}
            </div>

            {/* Nav Arrows */}
            <button
              onClick={() => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all z-20"
            >
              <ChevronLeft className="w-5 h-5 text-surface-700" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all z-20"
            >
              <ChevronRight className="w-5 h-5 text-surface-700" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || LayoutGrid;
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.name}`}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 md:w-[72px] md:h-[72px] bg-surface-50 group-hover:bg-primary-50 border-2 border-surface-200 group-hover:border-primary-500 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-surface-600 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-surface-700 group-hover:text-primary-500 transition-colors text-center">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 md:py-14 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="text-primary-500 hover:text-primary-600 text-sm font-semibold flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fashion Sale */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-900 to-surface-700 p-6 md:p-8 min-h-[200px] md:min-h-[240px] group">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Fashion Sale</h3>
                <p className="text-surface-300 text-sm md:text-base mb-4">Up to 50% Off on Top Brands</p>
                <Link to="/products?category=Fashion" className="inline-flex items-center gap-2 bg-white text-surface-900 font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-surface-100 transition-colors">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-40 md:w-52 h-full opacity-30 group-hover:opacity-50 transition-opacity">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop" alt="Fashion" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Home Essentials */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 p-6 md:p-8 min-h-[200px] md:min-h-[240px] group">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Home Essentials</h3>
                <p className="text-amber-100 text-sm md:text-base mb-4">Make Your Home Beautiful</p>
                <Link to="/products?category=Home & Living" className="inline-flex items-center gap-2 bg-white text-amber-700 font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-amber-50 transition-colors">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-40 md:w-52 h-full opacity-30 group-hover:opacity-50 transition-opacity">
                <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop" alt="Home" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Products */}
      <section className="py-10 md:py-14 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="section-title">Trending Now</h2>
            <Link to="/products" className="text-primary-500 hover:text-primary-600 text-sm font-semibold flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(4, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 md:py-14 bg-white border-t border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-8 md:mb-10">Why Choose ShopSphere?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((feat, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 mx-auto bg-primary-50 group-hover:bg-primary-500 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <feat.icon className="w-6 h-6 text-primary-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-surface-900 text-sm md:text-base">{feat.title}</h3>
                <p className="text-xs md:text-sm text-surface-500 mt-1">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
