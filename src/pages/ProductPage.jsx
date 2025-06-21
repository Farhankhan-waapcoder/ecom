import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser.email);
        setIsLoggedIn(true);

        // Handle cart merging
        const savedCart = JSON.parse(localStorage.getItem(`cart_${parsedUser.email}`)) || [];
        const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];

        const mergedCart = [...savedCart];
        guestCart.forEach((guestItem) => {
          const index = mergedCart.findIndex(item => item.id === guestItem.id);
          if (index !== -1) {
            mergedCart[index].quantity += guestItem.quantity;
          } else {
            mergedCart.push(guestItem);
          }
        });

        localStorage.setItem(`cart_${parsedUser.email}`, JSON.stringify(mergedCart));
        localStorage.removeItem("cart_guest");
        setCartItems(mergedCart);

        // Handle wishlist merging
        const savedWishlist = JSON.parse(localStorage.getItem(`wishlist_${parsedUser.email}`)) || [];
        const guestWishlist = JSON.parse(localStorage.getItem("wishlist_guest")) || [];

        const mergedWishlist = [...savedWishlist];
        guestWishlist.forEach((guestItem) => {
          const exists = mergedWishlist.find(item => item.id === guestItem.id);
          if (!exists) {
            mergedWishlist.push(guestItem);
          }
        });

        localStorage.setItem(`wishlist_${parsedUser.email}`, JSON.stringify(mergedWishlist));
        localStorage.removeItem("wishlist_guest");
        setWishlistItems(mergedWishlist);

      } catch (err) {
        console.error("Failed to parse user/cart/wishlist", err);
        setCurrentUser(null);
        setCartItems([]);
        setWishlistItems([]);
      }
    } else {
      // Load guest cart and wishlist
      const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
      const guestWishlist = JSON.parse(localStorage.getItem("wishlist_guest")) || [];
      setCartItems(guestCart);
      setWishlistItems(guestWishlist);
    }
  }, []);

  const allProducts = [
    {
      id: 101,
      name: "Premium Wireless Headphones",
      price: "$299",
      rating: 4.8,
      stock: 34,
      brand: "SoundX",
      category: "Electronics",
      description: "High-fidelity wireless headphones with noise cancellation and 30-hour battery life.",
      features: [
        "Active Noise Cancellation",
        "30 Hours Battery",
        "Bluetooth 5.2",
        "Soft Cushioned Earcups"
      ],
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 102,
      name: "Smart Fitness Watch",
      price: "$199",
      rating: 4.6,
      stock: 75,
      brand: "FitPro",
      category: "Electronics",
      description: "Track your workouts, sleep, heart rate, and more with this all-in-one smart fitness watch.",
      features: [
        "Heart Rate Monitor",
        "Step & Calorie Tracker",
        "Sleep Analysis",
        "Water Resistant"
      ],
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 103,
      name: "Laptop Stand Pro",
      price: "$89",
      rating: 4.9,
      stock: 58,
      brand: "ErgoTech",
      category: "Home & Garden",
      description: "Ergonomic aluminum laptop stand for comfortable working angles and improved posture.",
      features: [
        "Adjustable Height",
        "Aluminum Body",
        "Anti-Slip Pads",
        "Supports up to 17'' Laptops"
      ],
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51ca8?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 104,
      name: "Wireless Charging Pad",
      price: "$45",
      rating: 4.5,
      stock: 100,
      brand: "ChargeNow",
      category: "Electronics",
      description: "Sleek and fast Qi wireless charging pad compatible with all major phone brands.",
      features: [
        "Fast Charging Support",
        "Qi Certified",
        "Overheat Protection",
        "LED Charging Indicator"
      ],
      image: "https://images.unsplash.com/photo-1617975316514-69cd7e16c2a4?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 105,
      name: "Bluetooth Speaker",
      price: "$129",
      rating: 4.7,
      stock: 42,
      brand: "BoomBox",
      category: "Electronics",
      description: "Portable Bluetooth speaker with deep bass and 20 hours of playtime.",
      features: [
        "20 Hours Battery",
        "Water-Resistant",
        "Built-in Mic",
        "Stereo Sound"
      ],
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 106,
      name: "USB-C Hub",
      price: "$79",
      rating: 4.4,
      stock: 120,
      brand: "Portify",
      category: "Electronics",
      description: "Compact USB-C hub with HDMI, USB 3.0, SD Card, and Ethernet ports.",
      features: [
        "4-in-1 Hub",
        "4K HDMI Output",
        "Ethernet Support",
        "Plug & Play"
      ],
      image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 107,
      name: "Gaming Mouse",
      price: "$159",
      rating: 4.6,
      stock: 61,
      brand: "ClickX",
      category: "Electronics",
      description: "High-precision gaming mouse with RGB lighting and customizable buttons.",
      features: [
        "16000 DPI Sensor",
        "RGB Lighting",
        "6 Programmable Buttons",
        "Ergonomic Design"
      ],
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 108,
      name: "Mechanical Keyboard",
      price: "$189",
      rating: 4.8,
      stock: 45,
      brand: "KeyZilla",
      category: "Electronics",
      description: "Backlit mechanical keyboard with tactile switches and anti-ghosting technology.",
      features: [
        "Blue Switches",
        "RGB Backlight",
        "Full N-Key Rollover",
        "Detachable USB Cable"
      ],
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 109,
      name: "4K Webcam",
      price: "$199",
      rating: 4.5,
      stock: 88,
      brand: "ViewSharp",
      category: "Electronics",
      description: "Crystal clear 4K webcam for video conferencing, streaming, and content creation.",
      features: [
        "4K UHD Video",
        "Auto Light Correction",
        "Dual Stereo Mics",
        "Plug & Play USB"
      ],
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 201,
      name: "Premium Wireless Headphones",
      price: "$299",
      rating: 4.8,
      brand: "SoundX",
      category: "Electronics",
      stock: 35,
      description: "Experience immersive sound with noise cancellation and 30-hour battery life.",
      features: [
        "Noise Cancellation",
        "30-Hour Battery",
        "Bluetooth 5.2",
        "Ergonomic Fit"
      ],
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 202,
      name: "Smart Fitness Watch",
      price: "$199",
      rating: 4.6,
      brand: "FitPulse",
      category: "Electronics",
      stock: 50,
      description: "Track your health with precision and stay connected on the go.",
      features: [
        "Heart Rate & Sleep Monitor",
        "Waterproof Design",
        "Message Notifications",
        "7-Day Battery Life"
      ],
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 203,
      name: "MacBook Pro M3",
      price: "$1999",
      rating: 4.9,
      brand: "Apple",
      category: "Electronics",
      stock: 20,
      description: "Powerhouse M3 chip performance in a sleek and lightweight MacBook Pro.",
      features: [
        "M3 Chipset",
        "Retina Display",
        "20-Hour Battery",
        "Magic Keyboard"
      ],
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 204,
      name: "iPhone 15 Pro",
      price: "$999",
      rating: 4.7,
      brand: "Apple",
      category: "Electronics",
      stock: 45,
      description: "Latest iPhone with ProMotion, A17 chip, and incredible camera system.",
      features: [
        "A17 Bionic Chip",
        "48MP Camera",
        "ProMotion Display",
        "Ceramic Shield"
      ],
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 205,
      name: "AirPods Pro",
      price: "$249",
      rating: 4.5,
      brand: "Apple",
      category: "Electronics",
      stock: 60,
      description: "Comfortable, compact, and immersive AirPods with noise cancellation.",
      features: [
        "Active Noise Cancellation",
        "Transparency Mode",
        "MagSafe Charging",
        "Custom Fit Ear Tips"
      ],
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=60"
    }
  ];

  useEffect(() => {
    if (!id) return navigate('/not-found');

    const foundProduct = allProducts.find(p => p.id === parseInt(id));
    if (!foundProduct) return navigate('/not-found');

    setProduct(foundProduct);

    // Check if current product is in wishlist
    const wishlistKey = isLoggedIn && currentUser ? `wishlist_${currentUser}` : "wishlist_guest";
    const currentWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    const isProductWishlisted = currentWishlist.some(item => item.id === foundProduct.id);
    setIsWishlisted(isProductWishlisted);
  }, [id, navigate, isLoggedIn, currentUser]);

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    const cartKey = isLoggedIn && currentUser ? `cart_${currentUser}` : "cart_guest";
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingItemIndex = existingCart.findIndex((item) => item.id === product.id);

    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...existingCart, { ...product, quantity: quantity }];
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    setCartItems(updatedCart);

    toast.success(`${product.name} has been added to your cart`);
  };

  const handleToggleWishlist = (product) => {
    const wishlistKey = isLoggedIn && currentUser ? `wishlist_${currentUser}` : "wishlist_guest";
    const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

    const isCurrentlyWishlisted = existingWishlist.some(item => item.id === product.id);
    
    let updatedWishlist;
    if (isCurrentlyWishlisted) {
      // Remove from wishlist
      updatedWishlist = existingWishlist.filter(item => item.id !== product.id);
      setIsWishlisted(false);
      toast.success(`${product.name} has been removed from your wishlist`);
    } else {
      // Add to wishlist
      updatedWishlist = [...existingWishlist, product];
      setIsWishlisted(true);
      toast.success(`${product.name} has been added to your wishlist`);
    }

    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);
  };
  const handleBuy=()=>{
    navigate(`/checkout/${id}`);
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-300 hover:scale-105"
              />
              <button
                onClick={() => handleToggleWishlist(product)}
                className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm ${
                  isWishlisted ? 'bg-red-100 text-red-500' : 'bg-white/80 text-gray-600'
                } hover:scale-110 transition-all duration-200`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block text-sm bg-gray-200 text-gray-700 rounded px-2 py-1 mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-semibold text-gray-700">by {product.brand}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">{renderStars(product.rating)}</div>
                <span className="text-sm text-muted-foreground">{product.rating} rating</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">{product.price}</span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className={`flex items-center justify-center gap-2 flex-1 h-12 text-white rounded-lg transition ${
                  product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="h-12 px-4 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              onClick={()=>handleBuy()}
              >
                Buy Now
              </button>
            </div>

            {/* Key Features */}
            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Warranty</p>
                  <p className="text-xs text-muted-foreground">2 year coverage</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <RotateCcw className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">30-Day Returns</p>
                  <p className="text-xs text-muted-foreground">Easy returns</p>
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