import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import LoginModal from "../components/LoginModal"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import RegisterModal from "../components/RegisterModal"; 
import ForgotPasswordModal from "../components/ForgotPasswordModal"; 
import { Heart } from "lucide-react";

const Navbar = ({ cartCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "login", "register", "forgot"
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("user") ? true : false;
  });
 const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search/${encodeURIComponent(query.trim())}`);
    }
  };
  const handleProfileClick = () => {
    setIsLoginModalOpen(true); // or toggle a dropdown if you want
  };

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const openLogin = () => setModalType("login");
  const openRegister = () => setModalType("register");
  const openForgot = () => setModalType("forgot");
  const closeModal = () => setModalType(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    toast.success("user logged out");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { name: "Return Gifts", path: "/" },
    { name: "Diwali Diya", path: "/" },
    { name: "Frames", path: "/" },
    { name: "Combos", path: "/" },
    { name: "Cushions", path: "/" },
    { name: "Cutout Standy", path: "/" },
    { name: "Wallet", path: "/" },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-[#007580] flex-shrink-0">
            🎁 GiftGallery
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 mx-6 max-w-lg">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search here"
                value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
                className="w-full border rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring focus:border-[#007580]"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden xl:flex gap-4 text-sm font-medium text-gray-700">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="hover:text-[#007580] whitespace-nowrap transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            {/* Mobile Search */}
            <button
              onClick={toggleSearch}
              className="lg:hidden text-gray-700 hover:text-[#007580] p-2 hover:text-[#007580] whitespace-nowrap transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="hidden sm:block text-gray-700 hover:text-[#007580] text-sm font-medium transition-colors hover:text-[#007580] whitespace-nowrap transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={openLogin}
                className="hidden sm:block text-gray-700 hover:text-[#007580] text-sm font-medium transition-colors hover:text-[#007580] whitespace-nowrap transition-colors"
              >
                Login
              </button>
            )}

            {/* Wishlist Heart - Now visible on all screens */}
            <Link to="/wishlist" className="text-gray-700 hover:text-[#007580] p-2">
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link to="/my-cart" className="relative text-gray-700 hover:text-[#007580] p-2">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="xl:hidden text-gray-700 hover:text-[#007580] p-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar with animation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? "max-h-40 pt-4 pb-4 border-t border-gray-100" : "max-h-0"
          }`}
        >
          <div className="relative">
            <input
  type="text"
  placeholder="Search here"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={handleKeyDown}
  className="w-full border rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring focus:border-[#007580]"
  autoFocus={isSearchOpen}
/>

            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Mobile Menu with animation */}
        <div
          className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[500px] border-t border-gray-100" : "max-h-0"
          }`}
        >
          <nav className="py-4 space-y-2">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block px-4 py-2 text-gray-700 hover:text-[#007580] hover:bg-gray-50 transition-colors font-medium"
            >
              Account
            </Link>
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={closeMobileMenu}
                className="block px-4 py-2 text-gray-700 hover:text-[#007580] hover:bg-gray-50 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {modalType === "login" && (
        <LoginModal
          setIsLoggedIn={setIsLoggedIn}
          onClose={closeModal}
          onSwitchToRegister={openRegister}
          onSwitchToForgot={openForgot}
        />
      )}

      {modalType === "register" && (
        <RegisterModal
          onClose={closeModal}
          onSwitchToLogin={openLogin}
        />
      )}

      {modalType === "forgot" && (
        <ForgotPasswordModal
          onClose={closeModal}
          onSwitchToLogin={openLogin}
        />
      )}
    </header>
  );
};

export default Navbar;