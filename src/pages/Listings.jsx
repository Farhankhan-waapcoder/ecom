import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import LoginModal from "../components/LoginModal.jsx";
import RegisterModal from "../components/RegisterModal.jsx";
import ForgotPasswordModal from "../components/ForgotPasswordModal.jsx";
import ProductSlider from "../components/ProductSlider.jsx";
import CategorySlider from "../components/CategorySlider.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Listings() {
  const [showForgot, setShowForgot] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
   const toggleLogin = () => {
    setShowForgot(false);
    setShowRegister(false);
    setShowLogin(true);
  };

  const toggleForgot = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowForgot(true);
  };

  const toggleRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
    setShowForgot(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowForgot(false);
  };
 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser.email);
      setIsLoggedIn(true);

      const savedCart = JSON.parse(localStorage.getItem(`cart_${parsedUser.email}`)) || [];
      const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];

      // Merge guest cart into user's cart
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

    } catch (err) {
      console.error("Failed to parse user/cart", err);
      setCurrentUser(null);
      setCartItems([]);
    }
  }
}, []);

   const handleAddToCart = (product) => {
  const cartKey = isLoggedIn && currentUser ? `cart_${currentUser}` : "cart_guest";
  const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

  const existingItemIndex = existingCart.findIndex((item) => item.id === product.id);

  let updatedCart;
  if (existingItemIndex !== -1) {
    updatedCart = existingCart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [...existingCart, { ...product, quantity: 1 }];
  }

  localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  setCartItems(updatedCart);

  toast.success(`${product.name} has been added to your cart`);
};

const topPicks = [
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


  // Categories
  const categories = [
    {
      id: 1,
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=60",
      productCount: 156
    },
    {
      id: 2,
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=60",
      productCount: 243
    },
    {
      id: 3,
      name: "Home & Garden",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60",
      productCount: 89
    },
    {
      id: 4,
      name: "Sports",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=60",
      productCount: 127
    },
    {
      id: 5,
      name: "Books",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=60",
      productCount: 312
    },
    {
      id: 6,
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60",
      productCount: 94
    }
  ];

  // All products
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
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=60"
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
  }
];

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <main className="max-w-7xl mx-auto px-0 sm:px-1 lg:px-0 py-3">
      {/* Top Picks Slider */}
      <ProductSlider
        products={topPicks}
        title="Our Top Picks"
        onAddToCart={handleAddToCart}
      />

      {/* Categories Slider */}
      <CategorySlider
        categories={categories}
        title="Our Top Picked Categories"
      />

      {/* All Products Grid */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
          Featured Products
        </h2>
        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
          Discover our hand-picked selection of premium items
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </main>

    {/* Modal Backdrop */}
    {(showLogin || showRegister || showForgot) && (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 transition-all duration-300" />
    )}

    {/* Modals */}
    {showLogin && (
      <LoginModal
        setIsLoggedIn={setIsLoggedIn}
        onClose={closeModals}
        onSwitchToRegister={toggleRegister}
        onSwitchToForgot={toggleForgot}
      />
    )}

    {showForgot && (
      <ForgotPasswordModal
        onClose={closeModals}
        onSwitchToLogin={toggleLogin}
      />
    )}

    {showRegister && (
      <RegisterModal
        onClose={closeModals}
        onSwitchToLogin={toggleLogin}
      />
    )}
  </div>
);
}
