import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import ProductSlider from "../components/ProductSlider.jsx";
import CategorySlider from "../components/CategorySlider.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductSliderLoader from "../components/skeleton/ProductSliderLoader.jsx";
import { productAPI, categoryAPI } from "../services/Api.js";

export default function Listings() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // API data states
  const [topPicks, setTopPicks] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Loading states
  const [loadingTopPicks, setLoadingTopPicks] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Error states
  const [error, setError] = useState(null);

  // Initialize user and cart on component mount
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

  // Fetch top picks (limited products with high ratings)
  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        setLoadingTopPicks(true);
        const result = await productAPI.getAllProducts();
        
        if (result.success) {
          // Filter and sort by rating to get top picks
          const topRatedProducts = result.data
            .filter(product => product.rating?.rate >= 4.0)
            .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
            .slice(0, 5)
            .map(product => ({
              ...product,
              name: product.title, // Map title to name for consistency
              image: product.image,
              price: product.price,
              rating: product.rating?.rate || 0, // Extract the numeric rating
              ratingCount: product.rating?.count || 0, // Extract rating count separately
              originalRating: product.rating // Keep original rating object if needed
            }));
          
          setTopPicks(topRatedProducts);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        console.error("Failed to fetch top picks:", err);
        setError("Failed to load top picks");
        toast.error("Failed to load top picks");
      } finally {
        setLoadingTopPicks(false);
      }
    };

    fetchTopPicks();
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoadingProducts(true);
        const result = await productAPI.getAllProducts();
        
        if (result.success) {
          const formattedProducts = result.data.map(product => ({
            ...product,
            name: product.title, // Map title to name for consistency
            image: product.image,
            price: product.price,
            rating: product.rating?.rate || 0, // Extract the numeric rating
            ratingCount: product.rating?.count || 0, // Extract rating count separately
            originalRating: product.rating // Keep original rating object if needed
          }));
          
          setAllProducts(formattedProducts);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const result = await categoryAPI.getAllCategories();
        
        if (result.success) {
          // Format categories for CategorySlider component
          const formattedCategories = result.data.map((category, index) => ({
            id: index + 1,
            name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
            slug: category,
            image: getCategoryImage(category), // Helper function to get category images
            description: getCategoryDescription(category)
          }));
          
          setCategories(formattedCategories);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to get category images (you can customize these URLs)
  const getCategoryImage = (category) => {
    const categoryImages = {
      "men's clothing": "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&h=300&fit=crop",
      "women's clothing": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop",
      "jewelery": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      "electronics": "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop"
    };
    return categoryImages[category] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop";
  };

  // Helper function to get category descriptions
  const getCategoryDescription = (category) => {
    const descriptions = {
      "men's clothing": "Stylish and comfortable clothing for men",
      "women's clothing": "Fashion-forward apparel for women",
      "jewelery": "Elegant jewelry and accessories",
      "electronics": "Latest gadgets and electronic devices"
    };
    return descriptions[category] || "Discover amazing products in this category";
  };

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

    toast.success(`${product.name || product.title} has been added to your cart`);
  };

  // Retry function for failed API calls
  const handleRetry = () => {
    window.location.reload();
  };

  // Error boundary component
  if (error && !topPicks.length && !allProducts.length && !categories.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Failed to load products. Please try again.
          </p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <main className="container mx-auto px-6 py-3">
        {/* Top Picks Slider */}
        {loadingTopPicks ? (
          <ProductSliderLoader 
            title="Our Top Picks"
          />
        ) : topPicks.length > 0 ? (
          <ProductSlider
            products={topPicks}
            title="Our Top Picks"
            subtitle="Hand-picked premium products with excellent ratings"
            onAddToCart={handleAddToCart}
          />
        ) : (
          <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Top Picks Unavailable
            </h3>
            <p className="text-yellow-600 dark:text-yellow-300">
              We're having trouble loading our top picks. Please check back later.
            </p>
          </div>
        )}

        {/* Categories Slider */}
        {loadingCategories ? (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Top Picked Categories
            </h2>
            <div className="flex space-x-4 animate-pulse">
              {[...Array(4)].map((_, index) => (
               <div key={index} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 min-w-[200px] cursor-pointer group bg-gray-300 dark:bg-gray-600 rounded-lg h-42"></div>

              ))}
            </div>
          </div>
        ) : categories.length > 0 ? (
          <CategorySlider
            categories={categories}
            title="Our Top Picked Categories"
            subtitle="Explore our diverse range of product categories"
          />
        ) : (
          <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Categories Unavailable
            </h3>
            <p className="text-yellow-600 dark:text-yellow-300">
              We're having trouble loading categories. Please check back later.
            </p>
          </div>
        )}

        {/* All Products Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            Featured Products
          </h2>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Discover our hand-picked selection of premium items
          </p>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-600 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              No Products Available
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're having trouble loading products. Please try again later.
            </p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}

        {/* Loading indicator for background updates */}
        {(loadingTopPicks || loadingProducts || loadingCategories) && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}