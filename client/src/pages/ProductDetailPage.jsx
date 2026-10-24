import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, RotateCcw, Shield, Minus, Plus, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-surface-900">Product not found</h2>
        <Link to="/products" className="btn-primary inline-block mt-4">Browse Products</Link>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, product.colors?.[selectedColor], null, product.storage?.[selectedStorage]);
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/products?category=${product.category}`} className="hover:text-primary-500 transition-colors">{product.category}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-surface-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedImage ? 'border-primary-500 shadow-md' : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-surface-50 rounded-2xl overflow-hidden">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-[300px] md:h-[450px] object-contain p-4"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900">{product.name}</h1>
            <p className="text-surface-500 mt-1">{product.brand}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-300'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-surface-700">{product.rating}</span>
              <span className="text-sm text-surface-400">({product.reviews?.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-surface-900">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-lg text-surface-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {product.discount > 0 && (
                <span className="bg-green-50 text-green-700 text-sm font-bold px-2.5 py-1 rounded-md">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Colors */}
            {product.colors && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-surface-700 mb-2">Color:</p>
                <div className="flex gap-2">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        i === selectedColor ? 'border-primary-500 scale-110 shadow-md' : 'border-surface-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Storage */}
            {product.storage && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-surface-700 mb-2">Storage:</p>
                <div className="flex gap-2">
                  {product.storage.map((size, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedStorage(i)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        i === selectedStorage
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-surface-300 text-surface-600 hover:border-surface-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-surface-700 mb-2">Size:</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, i) => (
                    <button
                      key={i}
                      className="px-4 py-2 rounded-lg border-2 border-surface-300 text-sm font-medium text-surface-600 hover:border-primary-500 hover:text-primary-500 transition-all"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center border-2 border-surface-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-surface-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-surface-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-surface-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isInWishlist(product.id)
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-surface-300 text-surface-500 hover:border-red-300 hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Features */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-surface-200">
              {[
                { icon: Truck, text: 'Free Shipping' },
                { icon: RotateCcw, text: '7 Days Return' },
                { icon: Shield, text: 'Secure Payment' },
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-surface-500">
                  <feat.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{feat.text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-6 pt-6 border-t border-surface-200">
              <h3 className="font-semibold text-surface-900 mb-2">Product Description</h3>
              <p className="text-sm text-surface-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="section-title mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
