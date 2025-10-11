import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import SimilarProducts from '../components/SimilarProducts.jsx';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ArrowLeft, Upload, X, Share2, Facebook, Instagram, Twitter, Send, Check, Sparkles, Award, Clock, Package, Zap, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { productAPI } from '../services/Api.js';
import ProductLoader from '../components/skeleton/ProductLoader.jsx';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/Api.js';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [lastCursorPosition, setLastCursorPosition] = useState({ x: 0, y: 0 });
  const zoomFactor = 2.5;
  const DEBUG_ZOOM = true; // set to false to hide debug visuals
  
  // Customization states
  const [selectedSize, setSelectedSize] = useState('190 ml');
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedStyle, setSelectedStyle] = useState('2-sided');
  const [selectedDelivery, setSelectedDelivery] = useState('Standard');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('browse');
  const fileInputRef = useRef(null);
  const imageContainerRef = useRef(null);
  
  // API states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize user state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser.email);
        setIsLoggedIn(true);
        
        const savedCart = JSON.parse(localStorage.getItem(`cart_${parsedUser.email}`)) || [];
        setCartItems(savedCart);
      } catch (err) {
        console.error("Failed to parse user data", err);
        setCurrentUser(null);
        setCartItems([]);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
      setCartItems(guestCart);
    }
  }, []);

  function formatCurrency(amount) {
    const locale = navigator.language || 'en-US';
    const localeCurrencyMap = {
      'en-IN': 'INR',
      'hi-IN': 'INR',
      'en-US': 'USD',
      'en-GB': 'GBP',
      'fr-FR': 'EUR',
      'de-DE': 'EUR',
    };

    let currency = 'USD';
    for (const [key, value] of Object.entries(localeCurrencyMap)) {
      if(locale.startsWith(key)) {
        currency = value;
        break;
      }
    }

    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  }

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await adminApi.get(`/productdetails/?productId=${id}`);
        if (response.data.success) {
          const apiProduct = response.data.data;
          
          const transformedProduct = {
            id: apiProduct.productID,
            name: apiProduct.productName,
            brand: apiProduct.brandName || "Premium Brand",
            price: formatCurrency(apiProduct.price),
            originalPrice: formatCurrency(apiProduct.price * 1.2),
            discount: "20% off",
            rating: 4.5,
            reviews: 123,
            stock: apiProduct.stock ?? true,
            category: apiProduct.categoryName,
            description: apiProduct.description || "No description available",
            images: apiProduct.images.map(image => 
              `https://adminecommerce.waapcoders.in${image}`
            ),
            features: [
              "Premium Quality",
              "Custom Design",
              "Durable Material",
              "Perfect Gift Option",
              "Satisfaction Guaranteed"
            ],
            categoryID: apiProduct.categoryID,
            brandID: apiProduct.brandID
          };
          
          setProduct(transformedProduct);
        } else {
          throw new Error('Failed to fetch product');
        }
      } catch (err) {
        setError("Failed to load product details");
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Customization options
  const sizeOptions = [
    { value: '190 ml', label: '190 ml' },
    { value: '325 ml', label: '325 ml' },
    { value: '450 ml', label: '450 ml' }
  ];

  const colorOptions = [
    { value: 'white', label: 'White', color: '#ffffff', border: '#e5e5e5' },
    { value: 'black', label: 'Black', color: '#000000' },
    { value: 'green', label: 'Green', color: '#22c55e' },
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'red', label: 'Red', color: '#ef4444' },
    { value: 'pink', label: 'Pink', color: '#ec4899' },
    { value: 'orange', label: 'Orange', color: '#f97316' },
    { value: 'yellow', label: 'Yellow', color: '#eab308' },
    { value: 'navy', label: 'Navy', color: '#1e40af' }
  ];

  const styleOptions = [
    { value: '2-sided', label: '2-sided' },
    { value: 'wraparound', label: 'Wraparound' }
  ];

  const deliveryOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Same Day Delivery (Mumbai)', label: 'Same Day Delivery (Mumbai)' }
  ];

  const quantityPricing = [
    { qty: 1, price: 300, originalPrice: 300, savings: 0 },
    { qty: 2, price: 540, originalPrice: 600, savings: 10 },
    { qty: 3, price: 750, originalPrice: 900, savings: 16 },
    { qty: 4, price: 1000, originalPrice: 1200, savings: 16 },
    { qty: 5, price: 1250, originalPrice: 1500, savings: 16, recommended: true }
  ];

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, Math.min(product?.stock || 1, quantity + change)));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-all duration-200 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const handleAddToCart = () => {
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart`, {
      icon: '🛒',
      style: {
        borderRadius: '12px',
        background: '#10b981',
        color: '#fff',
      },
    });
  };
  
  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      icon: isWishlisted ? '💔' : '❤️',
      style: {
        borderRadius: '12px',
      },
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleBackToProducts = () => {
    navigate(-1);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const cursorX = e.clientX;
    const cursorY = e.clientY;
    
    setLastCursorPosition(cursorPosition);
    setCursorPosition({ x: cursorX, y: cursorY });
    
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    
    setZoomPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  // Debug: log popup position and make popup visually obvious while testing
  useEffect(() => {
    if (isZoomed) {
      try {
        const pos = getZoomPopupPosition();
        console.log('Zoom popup position:', pos);
      } catch (e) {
        console.error('Failed to compute zoom popup position', e);
      }
    }
  }, [isZoomed, zoomPosition]);

  const getZoomPopupPosition = () => {
    const popupSize = 300;
    const margin = 20;
    const viewportWidth = window.innerWidth;

    const defaultPos = {
      position: 'fixed',
      width: `${popupSize}px`,
      height: `${popupSize}px`,
      right: `${margin}px`,
      top: `${margin * 2}px`,
      zIndex: 60
    };

    const container = imageContainerRef.current;
    if (!container) return defaultPos;

    const rect = container.getBoundingClientRect();

    // Center popup vertically on the image container
    let top = rect.top + rect.height / 2 - popupSize / 2;
    top = Math.max(margin, Math.min(window.innerHeight - popupSize - margin, top));

    // Prefer placement to the right of the image container
    let left = rect.right + margin;

    // If not enough space on the right, place it to the left of the container
    if (left + popupSize > viewportWidth - margin) {
      left = rect.left - margin - popupSize;
    }

    // Clamp horizontally
    left = Math.max(margin, Math.min(viewportWidth - popupSize - margin, left));

    return {
      position: 'fixed',
      width: `${popupSize}px`,
      height: `${popupSize}px`,
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 60
    };
  };

  const getCurrentPricing = () => {
    return quantityPricing.find(p => p.qty === quantity) || quantityPricing[0];
  };

  // Loading state
  if (loading) {
    return <ProductLoader/>;
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
            <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Product Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBackToProducts}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover-lift shadow-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover-lift shadow-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPricing = getCurrentPricing();

  const generateShareLinks = (product) => {
    const currentUrl = window.location.href;
    const text = `Check out ${product.name} - ${product.description}`;
    
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + currentUrl)}`,
      instagram: `https://www.instagram.com/share?url=${encodeURIComponent(currentUrl)}`
    };
  };

  const ShareButtons = () => {
    const shareLinks = generateShareLinks(product);

    return (
      <div className="glass-effect rounded-2xl p-5 shadow-soft hover-lift transition-smooth">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Share2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Share this product</span>
        </div>
        
        <div className="flex gap-3">
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 hover-lift shadow-soft group"
          >
            <Send className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </a>
          
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover-lift shadow-soft group"
          >
            <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </a>
          
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black transition-all duration-200 hover-lift shadow-soft group"
          >
            <Twitter className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </a>
          
          <a
            href={shareLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 hover:opacity-90 transition-all duration-200 hover-lift shadow-soft group"
          >
            <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 pb-24 relative z-10">
        {/* Breadcrumb with modern styling */}
        <nav className="text-sm mb-6 flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 group">
            <span className="group-hover:underline">Home</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <Link
            to={`/categories/${product.categoryID}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize group"
          >
            <span className="group-hover:underline">{product.category}</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-700 dark:text-slate-200 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>
      
        {/* Main Content Grid */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 space-y-8 lg:space-y-0">
          {/* Left Side - Product Images */}
          <div className="relative">
            <div className="lg:sticky lg:top-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Thumbnail Images Sidebar */}
                <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px] scrollbar-custom">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 relative overflow-hidden rounded-2xl transition-all duration-300 border-2 group ${
                        selectedImageIndex === index 
                          ? 'border-blue-500 dark:border-blue-400 shadow-glow scale-105' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-105 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                        }}
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Main Image Container */}
                <div className="order-1 md:order-2 flex-1">
                  <div className="relative overflow-hidden rounded-3xl glass-effect shadow-large group">
                    <div 
                      ref={imageContainerRef}
                      className="relative w-full h-70 sm:h-96 md:h-[500px] lg:h-[500px] overflow-hidden cursor-crosshair bg-white dark:bg-slate-800"
                      onMouseMove={handleMouseMove}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={uploadedImage || product.images[selectedImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop';
                        }}
                      />
                      
                      {/* Zoom indicator overlay */}
                      {isZoomed && (
                        <div
                          className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none rounded-xl backdrop-blur-sm"
                          style={{
                            width: '100px',
                            height: '100px',
                            left: `${zoomPosition.x}%`,
                            top: `${zoomPosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                      )}
                    </div>

                    {/* Dynamic Zoom Panel */}
                    {isZoomed && createPortal(
                      <div
                        className="pointer-events-none border-4 border-white dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden glass-effect transition-all duration-200"
                        style={{
                          ...getZoomPopupPosition(),
                          zIndex: 9999,
                          background: DEBUG_ZOOM ? 'rgba(255,0,0,0.12)' : undefined,
                          outline: DEBUG_ZOOM ? '2px solid rgba(255,0,0,0.9)' : undefined,
                        }}
                      >
                        <div className="w-full h-full">
                          <div
                            aria-hidden
                            className="w-full h-full"
                            style={{
                              backgroundImage: `url(${uploadedImage || product.images[selectedImageIndex]})`,
                              backgroundSize: `${zoomFactor * 100}%`,
                              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                              backgroundRepeat: 'no-repeat',
                            }}
                          />
                        </div>

                        <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm shadow-soft">
                          {zoomFactor}x Zoom
                        </div>

                        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm shadow-soft">
                          📍 Smart View
                        </div>
                      </div>,
                      document.body
                    )}

                    </div>
                  </div>
                </div>
              </div>
            </div>

                  {/* Right Side - Product Details */}
                  <div className="lg:overflow-y-auto lg:pr-4 space-y-6 scrollbar-custom lg:max-h-[calc(100vh-8rem)]">
            {/* Product Info Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-4 py-1.5 font-semibold shadow-soft">
                  <Sparkles className="w-4 h-4" />
                  {product.category}
                </span>
                <span className="inline-flex items-center gap-2 text-sm glass-effect text-slate-700 dark:text-slate-300 rounded-full px-4 py-1.5 font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight gradient-text">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">by {product.brand}</span>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">{renderStars(product.rating)}</div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-slate-500 dark:text-slate-500">({product.reviews} reviews)</span>
                <span className="text-sm glass-effect px-3 py-1 rounded-full text-green-600 dark:text-green-400 font-medium">
                  ⭐ Highly Rated
                </span>
              </div>
            </div>

            {/* Price Section with modern gradient */}
            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 shadow-medium">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
              <div className="relative z-10">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {product.price}
                  </span>
                  <span className="text-2xl text-slate-400 dark:text-slate-500 line-through">{product.originalPrice}</span>
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-soft">
                    {product.discount}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Truck className="w-4 h-4" />
                  <span className="font-medium">Free delivery on orders above $50</span>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <ShareButtons />

            {/* Stock Status with animation */}
            <div className="flex items-center gap-3 p-5 glass-effect rounded-2xl shadow-soft">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-green-500 dark:bg-green-400 animate-pulse-slow" />
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 dark:bg-green-400 animate-ping opacity-75" />
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-green-700 dark:text-green-300">
                  In Stock ({product.stock} available)
                </span>
              </div>
            </div>

            {/* Size Selection with modern cards */}
            <div className="glass-effect rounded-3xl p-6 shadow-soft">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Size
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {sizeOptions.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={`p-4 rounded-2xl border-2 text-center font-semibold transition-all duration-200 hover-lift ${
                      selectedSize === size.value
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-soft scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inside Color with enhanced visual */}
            <div className="glass-effect rounded-3xl p-6 shadow-soft">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Inside Color
              </h3>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`relative w-14 h-14 rounded-2xl border-4 transition-all duration-200 hover-lift ${
                      selectedColor === color.value
                        ? 'border-blue-500 scale-110 shadow-glow'
                        : 'border-gray-300 dark:border-gray-600 hover:scale-105 hover:border-blue-300'
                    }`}
                    style={{ 
                      backgroundColor: color.color,
                      borderColor: selectedColor === color.value ? '#3b82f6' : (color.border || color.color)
                    }}
                    title={color.label}
                  >
                    {selectedColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-6 h-6 text-white drop-shadow-lg" style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                        }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="glass-effect rounded-3xl p-6 shadow-soft">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                Style
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {styleOptions.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={`p-4 rounded-2xl border-2 text-center font-semibold transition-all duration-200 hover-lift ${
                      selectedStyle === style.value
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-soft scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Speed */}
            <div className="glass-effect rounded-3xl p-6 shadow-soft">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Delivery Speed
              </h3>
              <div className="space-y-3">
                {deliveryOptions.map((delivery) => (
                  <button
                    key={delivery.value}
                    onClick={() => setSelectedDelivery(delivery.value)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all duration-200 hover-lift flex items-center gap-3 ${
                      selectedDelivery === delivery.value
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-soft'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                    {delivery.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection with Pricing */}
            <div className="glass-effect rounded-3xl p-6 shadow-soft">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Quantity & Pricing
              </h3>
              <div className="space-y-3">
                {quantityPricing.map((pricing) => (
                  <button
                    key={pricing.qty}
                    onClick={() => setQuantity(pricing.qty)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 hover-lift ${
                      quantity === pricing.qty
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-soft scale-[1.02]'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                        quantity === pricing.qty
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {pricing.qty}
                      </div>
                      {pricing.recommended && (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-soft">
                          ⭐ Best Value
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-slate-800 dark:text-slate-200">₹{pricing.price}.00</div>
                      {pricing.savings > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="line-through">₹{pricing.originalPrice}.00</span>
                          <span className="text-green-600 dark:text-green-400 ml-2 font-semibold">{pricing.savings}% OFF</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Current Selection Summary */}
              <div className="mt-5 p-5 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {quantity} item{quantity > 1 ? 's' : ''} starting at
                  </span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    ₹{currentPricing.price}.00
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                  <Truck className="w-4 h-4" />
                  Free shipping by 6 August to 110001
                </div>
              </div>
            </div>

            {/* Design Upload Section */}
            <div className="glass-effect rounded-3xl p-6 shadow-soft">
              <div className="flex gap-3 mb-5">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`flex-1 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === 'browse'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-soft'
                      : 'glass-effect text-gray-700 dark:text-gray-300 hover:scale-105'
                  }`}
                >
                  Browse designs
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-soft'
                      : 'glass-effect text-gray-700 dark:text-gray-300 hover:scale-105'
                  }`}
                >
                  Upload design
                </button>
              </div>

              {activeTab === 'browse' && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mb-4 font-medium">Choose one of our templates</div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-soft hover-lift">
                    Browse Templates
                  </button>
                </div>
              )}

              {activeTab === 'upload' && (
                <div>
                  {!uploadedImage ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 group"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 font-semibold mb-2 text-lg">
                        Have a design? Upload and edit it
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Click to upload or drag and drop your image
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Uploaded design"
                        className="w-full h-64 object-cover rounded-2xl shadow-medium"
                      />
                      <button
                        onClick={removeUploadedImage}
                        className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-soft hover-lift"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          Change Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Features */}
            <div className="glass-effect shadow-soft rounded-3xl p-6">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-5 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Product Features
              </h3>
              <ul className="space-y-4">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-400 font-medium pt-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-soft hover-lift transition-smooth group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Free Shipping</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">On orders over ₹50</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl shadow-soft hover-lift transition-smooth group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">100% Satisfaction</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Guaranteed</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-soft hover-lift transition-smooth group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Easy Returns</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 glass-effect p-4 shadow-large z-50 lg:hidden border-t border-white/20">
          <div className="flex gap-3">
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-soft active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="h-14 px-6 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-2xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 active:scale-95"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:block lg:sticky lg:bottom-6 glass-effect p-5 rounded-3xl shadow-large mt-8">
          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 flex-1 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover-lift shadow-soft text-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="h-16 px-10 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-2xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover-lift text-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;