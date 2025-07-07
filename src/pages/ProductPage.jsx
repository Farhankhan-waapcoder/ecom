import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  // Sample product data (same for all products as requested)
  const product = {
    id: parseInt(id || '1'),
    name: "Ubon Type-C TC-186 Wired Earphones Gaming Headset",
    brand: "Ubon",
    price: "₹214",
    originalPrice: "₹799",
    discount: "73% off",
    rating: 4.0,
    reviews: 266,
    stock: 15,
    category: "Electronics",
    description: "Premium quality wired earphones with superior sound quality, comfortable fit, and durable design. Perfect for gaming, music, and calls with crystal clear audio delivery.",
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "High-quality audio drivers for superior sound",
      "Comfortable ergonomic design",
      "Durable build quality",
      "Universal compatibility",
      "In-line microphone for calls"
    ]
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleAddToCart = () => {
    toast.success("Added to Cart");
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success( isWishlisted?"Added to Wishlist":"Removed from Wishlist");
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${id}`)
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  // Calculate zoom popup position to avoid overlapping with hover area
  const getZoomPopupPosition = () => {
    const popupSize = 256; // 16rem = 256px
    const margin = 16; // 1rem = 16px
    
    // Default position
    let position = {
      top: margin,
      left: margin,
      right: 'auto',
      bottom: 'auto'
    };

    // If hovering on left side, show popup on right
    if (zoomPosition.x < 50) {
      position.right = margin;
      position.left = 'auto';
    }
    
    // If hovering on top, show popup on bottom
    if (zoomPosition.y < 30) {
      position.bottom = margin;
      position.top = 'auto';
    }

    return position;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Thumbnail Images Sidebar */}
            <div className="flex flex-col gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative overflow-hidden rounded-xl transition-all duration-200 border-2 ${
                    selectedImageIndex === index 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300 hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-16 h-16 lg:w-20 lg:h-20 object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image Container */}
            <div className="flex-1 space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg group">
                <div 
                  className="relative w-full h-96 lg:h-[500px] overflow-hidden cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Zoom Indicator Overlay */}
                  {isZoomed && (
                    <div 
                      className="absolute border-2 border-white shadow-lg pointer-events-none"
                      style={{
                        width: '100px',
                        height: '100px',
                        left: `${zoomPosition.x}%`,
                        top: `${zoomPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      }}
                    />
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={handleToggleWishlist}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-200 z-20 ${
                    isWishlisted 
                      ? 'bg-red-100 text-red-500 scale-110' 
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-110'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Smart Positioned Zoom Popup */}
                {isZoomed && (
                  <div 
                    className="absolute w-64 h-64 bg-white rounded-xl shadow-2xl border-4 border-white overflow-hidden z-30 pointer-events-none"
                    style={getZoomPopupPosition()}
                  >
                    <div
                      className="w-full h-full bg-no-repeat"
                      style={{
                        backgroundImage: `url(${product.images[selectedImageIndex]})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: '300%',
                      }}
                    />
                    {/* Zoom popup label */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Zoom: 3x
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block text-sm bg-blue-100 text-blue-700 rounded-full px-3 py-1 mb-3 font-medium">
                {product.category}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-semibold text-slate-700">by {product.brand}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
                <span className="text-sm text-slate-600">{product.rating}</span>
                <span className="text-sm text-slate-500">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-slate-800">{product.price}</span>
                <span className="text-xl text-slate-400 line-through">{product.originalPrice}</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {product.discount}
                </span>
              </div>
              <p className="text-sm text-slate-600">Free delivery on orders above ₹500</p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-green-700">
                In Stock ({product.stock} available)
              </span>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-2">Product Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-slate-700">Quantity:</span>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-3 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 font-semibold text-slate-800 bg-slate-50">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-3 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.02]"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="h-14 px-8 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                Buy Now
              </button>
            </div>

            {/* Key Features */}
            <div className="bg-white shadow-sm rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <Truck className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-sm text-slate-800">Free Shipping</p>
                  <p className="text-xs text-slate-600">On orders over ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm text-slate-800">Warranty</p>
                  <p className="text-xs text-slate-600">2 year coverage</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <RotateCcw className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-sm text-slate-800">30-Day Returns</p>
                  <p className="text-xs text-slate-600">Easy returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;