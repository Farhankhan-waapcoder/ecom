import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { productAPI } from '../services/Api.js';
import ProductLoader from '../components/skeleton/ProductLoader.jsx';
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  
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
        
        const result = await productAPI.getProductById(id);
        
        if (result.success) {
          const apiProduct = result.data;
          
          // Transform API data to match component structure
          const transformedProduct = {
            id: apiProduct.id,
            name: apiProduct.title,
            brand: getBrandFromCategory(apiProduct.category),
            price: `$${apiProduct.price}`,
            originalPrice: `$${(apiProduct.price * 1.4).toFixed(2)}`, // Simulate original price
            discount: "30% off", // Simulate discount
            rating: apiProduct.rating?.rate || 0,
            reviews: apiProduct.rating?.count || 0,
            stock: Math.floor(Math.random() * 50) + 10, // Simulate stock
            category: capitalizeCategory(apiProduct.category),
            description: apiProduct.description,
            images: generateProductImages(apiProduct.image, apiProduct.category),
            features: generateFeatures(apiProduct.category),
            originalData: apiProduct // Keep original data for reference
          };
          
          setProduct(transformedProduct);
          
          // Check if product is in wishlist
          const wishlistKey = isLoggedIn && currentUser ? `wishlist_${currentUser}` : "wishlist_guest";
          const wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
          setIsWishlisted(wishlist.some(item => item.id === apiProduct.id));
          
        } else {
          throw new Error(result.message || 'Failed to fetch product');
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(err.message || "Failed to load product details");
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isLoggedIn, currentUser]);

  // Helper function to get brand from category
  const getBrandFromCategory = (category) => {
    const brandMap = {
      "electronics": "TechPro",
      "jewelery": "LuxeCraft",
      "men's clothing": "StyleMen",
      "women's clothing": "FashionForte"
    };
    return brandMap[category] || "Premium Brand";
  };

  // Helper function to capitalize category
  const capitalizeCategory = (category) => {
    return category.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Helper function to generate multiple product images
  const generateProductImages = (mainImage, category) => {
    const images = [mainImage]; // Start with the main image
    
    // Add category-specific placeholder images
    const categoryImages = {
      "electronics": [
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=600&fit=crop"
      ],
      "jewelery": [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=600&fit=crop"
      ],
      "men's clothing": [
        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=600&fit=crop"
      ],
      "women's clothing": [
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=600&fit=crop"
      ]
    };

    // Add 2-3 additional images based on category
    const additionalImages = categoryImages[category] || categoryImages["electronics"];
    images.push(...additionalImages.slice(0, 3));

    return images;
  };

  // Helper function to generate category-specific features
  const generateFeatures = (category) => {
    const featureMap = {
      "electronics": [
        "High-quality build and components",
        "Latest technology integration",
        "Energy efficient design",
        "Universal compatibility",
        "1-year manufacturer warranty"
      ],
      "jewelery": [
        "Premium quality materials",
        "Elegant and timeless design",
        "Hypoallergenic and safe",
        "Comes with authenticity certificate",
        "Perfect for special occasions"
      ],
      "men's clothing": [
        "Premium fabric quality",
        "Comfortable and breathable",
        "Modern fit and style",
        "Easy care and maintenance",
        "Versatile for multiple occasions"
      ],
      "women's clothing": [
        "High-quality fabric blend",
        "Flattering and comfortable fit",
        "Trendy and fashionable design",
        "Machine washable",
        "Perfect for everyday wear"
      ]
    };
    
    return featureMap[category] || featureMap["electronics"];
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, Math.min(product?.stock || 1, quantity + change)));
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
    if (!product) return;

    const cartKey = isLoggedIn && currentUser ? `cart_${currentUser}` : "cart_guest";
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const cartProduct = {
      id: product.id,
      name: product.name,
      title: product.name,
      price: parseFloat(product.price.replace('$', '')),
      image: product.images[0],
      category: product.category,
      quantity: quantity
    };

    const existingItemIndex = existingCart.findIndex((item) => item.id === product.id);

    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...existingCart, cartProduct];
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    const wishlistKey = isLoggedIn && currentUser ? `wishlist_${currentUser}` : "wishlist_guest";
    const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

    const wishlistProduct = {
      id: product.id,
      name: product.name,
      title: product.name,
      price: parseFloat(product.price.replace('$', '')),
      image: product.images[0],
      category: product.category
    };

    let updatedWishlist;
    const existingIndex = existingWishlist.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
      // Remove from wishlist
      updatedWishlist = existingWishlist.filter(item => item.id !== product.id);
      setIsWishlisted(false);
      toast.success("Removed from wishlist");
    } else {
      // Add to wishlist
      updatedWishlist = [...existingWishlist, wishlistProduct];
      setIsWishlisted(true);
      toast.success("Added to wishlist");
    }

    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
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
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const getZoomPopupPosition = () => {
    const popupSize = 256;
    const margin = 16;
    
    let position = {
      top: margin,
      left: margin,
      right: 'auto',
      bottom: 'auto'
    };

    if (zoomPosition.x < 50) {
      position.right = margin;
      position.left = 'auto';
    }
    
    if (zoomPosition.y < 30) {
      position.bottom = margin;
      position.top = 'auto';
    }

    return position;
  };

  // Loading state
  if (loading) {
    return (
     <ProductLoader/>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
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
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToProducts}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

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
                      ? 'border-blue-500 dark:border-blue-400 shadow-lg scale-105' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-16 h-16 lg:w-20 lg:h-20 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Main Image Container */}
            <div className="flex-1 space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg group">
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
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop';
                    }}
                  />
                  
                  {/* Zoom Indicator Overlay */}
                  {isZoomed && (
                    <div 
                      className="absolute border-2 border-white dark:border-slate-300 shadow-lg pointer-events-none"
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
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400 scale-110' 
                      : 'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 hover:scale-110'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Smart Positioned Zoom Popup */}
                {isZoomed && (
                  <div 
                    className="absolute w-64 h-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-4 border-white dark:border-slate-700 overflow-hidden z-30 pointer-events-none"
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
                    <div className="absolute bottom-2 left-2 bg-black/70 dark:bg-slate-900/80 text-white text-xs px-2 py-1 rounded">
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
              <span className="inline-block text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 mb-3 font-medium">
                {product.category}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">by {product.brand}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
                <span className="text-sm text-slate-600 dark:text-slate-400">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-slate-500 dark:text-slate-500">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-200">{product.price}</span>
                <span className="text-xl text-slate-400 dark:text-slate-500 line-through">{product.originalPrice}</span>
                <span className="bg-red-500 dark:bg-red-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {product.discount}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Free delivery on orders above $50</p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
              <span className="font-medium text-green-700 dark:text-green-300">
                In Stock ({product.stock} available)
              </span>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Product Description</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center border-2 border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </button>
                <span className="px-6 py-3 font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </button>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Max: {product.stock}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity > product.stock}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="h-14 px-8 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity > product.stock}
              >
                Buy Now
              </button>
            </div>

            {/* Key Features */}
            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full" />
                    <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Free Shipping</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Warranty</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">1 year coverage</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                <RotateCcw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">30-Day Returns</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Easy returns</p>
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