// "use client"

// import { Link } from "react-router-dom"
// import toast from "react-hot-toast"
// import { ShoppingCart, X, Search, Heart, User, ChevronDown } from "lucide-react"
// import { useState, useEffect } from "react"
// import LoginModal from "./LoginModal"
// import { useNavigate } from "react-router-dom"
// import RegisterModal from "./RegisterModal"
// import ForgotPasswordModal from "./ForgotPasswordModal"

// const Navbar = ({ cartCount = 0 }) => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [isSearchOpen, setIsSearchOpen] = useState(false)
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
//   const [modalType, setModalType] = useState(null)
//   const [query, setQuery] = useState("")
//   const [scrolled, setScrolled] = useState(false)
//   const navigate = useNavigate()
//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     return localStorage.getItem("user") ? true : false
//   })

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20)
//     }
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   // Close mobile menu on resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1280) {
//         setIsMobileMenuOpen(false)
//       }
//     }
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && query.trim()) {
//       navigate(`/search/${encodeURIComponent(query.trim())}`)
//       setIsSearchOpen(false)
//     }
//   }

//   const handleLogin = (userData) => {
//     localStorage.setItem("user", JSON.stringify(userData))
//     setIsLoggedIn(true)
//     setModalType(null)
//   }

//   const openLogin = () => setModalType("login")
//   const openRegister = () => setModalType("register")
//   const openForgot = () => setModalType("forgot")
//   const closeModal = () => setModalType(null)

//   const handleLogout = () => {
//     localStorage.removeItem("user")
//     setIsLoggedIn(false)
//     setIsUserMenuOpen(false)
//     toast.success("User logged out successfully")
//   }

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen)
//     setIsSearchOpen(false)
//     setIsUserMenuOpen(false)
//   }

//   const toggleSearch = () => {
//     setIsSearchOpen(!isSearchOpen)
//     setIsMobileMenuOpen(false)
//     setIsUserMenuOpen(false)
//   }

//   const toggleUserMenu = () => {
//     setIsUserMenuOpen(!isUserMenuOpen)
//     setIsMobileMenuOpen(false)
//     setIsSearchOpen(false)
//   }

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false)
//   }

//   const menuItems = [
//     { name: "Your Orders", path: "/order-history" },
//     { name: "Diwali Diya", path: "/" },
//     { name: "Frames", path: "/" },
//     { name: "Combos", path: "/"},
//     { name: "Cushions", path: "/" },
//     { name: "Cutout Standy", path: "/" },
//     { name: "Wallet", path: "/" },
//   ]

//   return (
//     <>
//       <header
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" : "bg-white shadow-md"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
//           <div className="flex justify-between items-center h-16 lg:h-20">
//             {/* Logo */}
//             <Link
//               to="/"
//               className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-[#007580] hover:text-[#005a63] transition-all duration-300 transform hover:scale-105"
//             >
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#007580] to-[#005a63] rounded-xl flex items-center justify-center text-white text-lg sm:text-xl shadow-lg">
//                 🎁
//               </div>
//               <span className="hidden sm:block bg-gradient-to-r from-[#007580] to-[#005a63] bg-clip-text text-transparent">
//                 GiftGallery
//               </span>
//             </Link>

//             {/* Desktop Search */}
//             <div className="hidden lg:flex flex-1 mx-8 max-w-2xl">
//               <div className="relative w-full group">
//                 <input
//                   type="text"
//                   placeholder="Search for gifts, frames, combos..."
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-3 pr-12 focus:outline-none focus:bg-white focus:border-[#007580] focus:shadow-lg transition-all duration-300 text-gray-700 placeholder-gray-400"
//                 />
//                 <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
//                   <Search className="text-gray-400 group-focus-within:text-[#007580] w-5 h-5 transition-colors duration-300" />
//                 </div>
//               </div>
//             </div>

//             {/* Desktop Menu */}
//             <nav className="hidden xl:flex items-center gap-1">
//               {menuItems.slice(0, 5).map((item, index) => (
//                 <Link
//                   key={index}
//                   to={item.path}
//                   className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#007580] rounded-xl hover:bg-gray-50 transition-all duration-300 group"
//                 >
//                   <span className="flex items-center space-x-1">
//                     {/* <span>{item.icon}</span> */}
//                     <span>{item.name}</span>
//                   </span>
//                   <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#007580] group-hover:w-full transition-all duration-300"></div>
//                 </Link>
//               ))}
//               <div className="relative group">
//                 <button className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#007580] rounded-xl hover:bg-gray-50 transition-all duration-300">
//                   <span>More</span>
//                   <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
//                 </button>
//                 <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
//                   {menuItems.slice(5).map((item, index) => (
//                     <Link
//                       key={index}
//                       to={item.path}
//                       className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:text-[#007580] hover:bg-gray-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
//                     >
//                       {/* <span>{item.icon}</span> */}
//                       <span>{item.name}</span>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             </nav>

//             {/* Right Actions */}
//             <div className="flex items-center space-x-1 sm:space-x-2">
//               {/* Mobile Search */}
//               <button
//                 onClick={toggleSearch}
//                 className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
//                   isSearchOpen
//                     ? "bg-[#007580] text-white shadow-lg"
//                     : "text-gray-700 hover:text-[#007580] hover:bg-gray-50"
//                 }`}
//               >
//                 <Search className="w-5 h-5" />
//               </button>

//               {/* User Account */}
//               <div className="relative">
//                 {isLoggedIn ? (
//                   <button
//                     onClick={toggleUserMenu}
//                     className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
//                       isUserMenuOpen
//                         ? "bg-[#007580] text-white shadow-lg"
//                         : "text-gray-700 hover:text-[#007580] hover:bg-gray-50"
//                     }`}
//                   >
//                     <User className="w-4 h-4" />
//                     <span className="text-sm font-medium">Account</span>
//                     <ChevronDown
//                       className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`}
//                     />
//                   </button>
//                 ) : (
//                   <button
//                     onClick={openLogin}
//                     className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-[#007580] hover:bg-gray-50 rounded-xl transition-all duration-300"
//                   >
//                     <User className="w-4 h-4" />
//                     <span className="text-sm font-medium">Login</span>
//                   </button>
//                 )}

//                 {/* User Dropdown */}
//                 {isLoggedIn && (
//                   <div
//                     className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-300 transform ${
//                       isUserMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
//                     }`}
//                   >
//                     <Link
//                       to="/profile"
//                       className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:text-[#007580] hover:bg-gray-50 transition-colors duration-200 rounded-t-xl"
//                     >
//                       <User className="w-4 h-4" />
//                       <span>My Profile</span>
//                     </Link>
//                     <Link
//                       to="/orders"
//                       className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:text-[#007580] hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       <ShoppingCart className="w-4 h-4" />
//                       <span>My Orders</span>
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 rounded-b-xl"
//                     >
//                       <X className="w-4 h-4" />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Wishlist */}
//               <Link
//                 to="/wishlist"
//                 className="relative p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group"
//               >
//                 <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
//                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               </Link>

//               {/* Cart */}
//               <Link
//                 to="/my-cart"
//                 className="relative p-2 text-gray-700 hover:text-[#007580] hover:bg-gray-50 rounded-xl transition-all duration-300 group"
//               >
//                 <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
//                     {cartCount > 99 ? "99+" : cartCount}
//                   </span>
//                 )}
//               </Link>

//               {/* Mobile Menu Toggle */}
//               <button
//                 onClick={toggleMobileMenu}
//                 className={`xl:hidden p-2 rounded-xl transition-all duration-300 ${
//                   isMobileMenuOpen
//                     ? "bg-[#007580] text-white shadow-lg"
//                     : "text-gray-700 hover:text-[#007580] hover:bg-gray-50"
//                 }`}
//               >
//                 <div className="relative w-5 h-5">
//                   <span
//                     className={`absolute top-0 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
//                       isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
//                     }`}
//                   ></span>
//                   <span
//                     className={`absolute top-2 left-0 w-full h-0.5 bg-current transition-all duration-300 ${
//                       isMobileMenuOpen ? "opacity-0" : ""
//                     }`}
//                   ></span>
//                   <span
//                     className={`absolute top-4 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
//                       isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
//                     }`}
//                   ></span>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Mobile Search Bar */}
//           <div
//             className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
//               isSearchOpen ? "max-h-20 pb-4" : "max-h-0"
//             }`}
//           >
//             <div className="relative group">
//               <input
//                 type="text"
//                 placeholder="Search for gifts..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-3 pr-12 focus:outline-none focus:bg-white focus:border-[#007580] focus:shadow-lg transition-all duration-300 text-gray-700 placeholder-gray-400"
//                 autoFocus={isSearchOpen}
//               />
//               <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
//                 <Search className="text-gray-400 group-focus-within:text-[#007580] w-5 h-5 transition-colors duration-300" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu Overlay */}
//         <div
//           className={`xl:hidden fixed inset-0 bg-black transition-opacity duration-300 ${
//             isMobileMenuOpen ? "opacity-50 visible" : "opacity-0 invisible"
//           }`}
//           style={{ top: scrolled ? "64px" : "80px" }}
//           onClick={closeMobileMenu}
//         ></div>

//         {/* Mobile Menu */}
//         <div
//           className={`xl:hidden fixed left-0 right-0 bg-white border-t border-gray-100 shadow-2xl transition-all duration-500 ease-out transform ${
//             isMobileMenuOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
//           }`}
//           style={{ top: scrolled ? "64px" : "80px" }}
//         >
//           <div className="max-w-7xl mx-auto px-4 py-6">
//             {/* Mobile User Section */}
//             {isLoggedIn ? (
//               <div className="mb-6 p-4 bg-gradient-to-r from-[#007580] to-[#005a63] rounded-2xl text-white">
//                 <div className="flex items-center space-x-3 mb-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                     <User className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="font-semibold">Welcome back!</p>
//                     <p className="text-sm opacity-90">Manage your account</p>
//                   </div>
//                 </div>
//                 <div className="flex space-x-2">
//                   <Link
//                     to="/profile"
//                     onClick={closeMobileMenu}
//                     className="flex-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-center text-sm font-medium transition-colors duration-200"
//                   >
//                     Profile
//                   </Link>
//                   <Link
//                     to="/orders"
//                     onClick={closeMobileMenu}
//                     className="flex-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-center text-sm font-medium transition-colors duration-200"
//                   >
//                     Orders
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="flex-1 bg-red-500/80 hover:bg-red-500 px-4 py-2 rounded-xl text-center text-sm font-medium transition-colors duration-200"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
//                 <p className="text-gray-600 mb-3">Join GiftGallery today!</p>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => {
//                       openLogin()
//                       closeMobileMenu()
//                     }}
//                     className="flex-1 bg-[#007580] hover:bg-[#005a63] text-white px-4 py-2 rounded-xl text-center text-sm font-medium transition-colors duration-200"
//                   >
//                     Login
//                   </button>
//                   <button
//                     onClick={() => {
//                       openRegister()
//                       closeMobileMenu()
//                     }}
//                     className="flex-1 border-2 border-[#007580] text-[#007580] hover:bg-[#007580] hover:text-white px-4 py-2 rounded-xl text-center text-sm font-medium transition-colors duration-200"
//                   >
//                     Register
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Mobile Navigation */}
//             <nav className="space-y-2">
//               {menuItems.map((item, index) => (
//                 <Link
//                   key={index}
//                   to={item.path}
//                   onClick={closeMobileMenu}
//                   className="flex items-center space-x-4 p-4 text-gray-700 hover:text-[#007580] hover:bg-gray-50 rounded-2xl transition-all duration-300 group"
//                   style={{ animationDelay: `${index * 50}ms` }}
//                 >
//                   {/* <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#007580] rounded-xl flex items-center justify-center transition-colors duration-300">
//                     <span className="text-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
//                   </div> */}
//                   <span className="font-medium">{item.name}</span>
                  
//                   <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <ChevronDown className="w-4 h-4 -rotate-90" />
//                   </div>
//                 </Link>
//               ))}
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Spacer to prevent content from hiding behind fixed navbar */}
//       <div className="h-16 lg:h-20"></div>

//       {/* Modals */}
//       {modalType === "login" && (
//         <LoginModal
//           setIsLoggedIn={setIsLoggedIn}
//           onClose={closeModal}
//           onSwitchToRegister={openRegister}
//           onSwitchToForgot={openForgot}
//         />
//       )}

//       {modalType === "register" && <RegisterModal onClose={closeModal} onSwitchToLogin={openLogin} />}

//       {modalType === "forgot" && <ForgotPasswordModal onClose={closeModal} onSwitchToLogin={openLogin} />}
//     </>
//   )
// }

// export default Navbar

import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { ShoppingCart, X, Search, Heart, User, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import LoginModal from "./LoginModal"
import { useNavigate } from "react-router-dom"
import RegisterModal from "./RegisterModal"
import ForgotPasswordModal from "./ForgotPasswordModal"
import CartDropdown from "./CartDropdown"

const Navbar = ({ cartCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [query, setQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [currentCartCount, setCurrentCartCount] = useState(0)
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("user") ? true : false
  })

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const storedUser = localStorage.getItem("user");
      let cartItems = [];
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const savedCart = localStorage.getItem(`cart_${parsedUser.email}`);
        if (savedCart) {
          try {
            cartItems = JSON.parse(savedCart);
          } catch (error) {
            console.error("Failed to parse cart:", error);
          }
        }
      } else {
        const guestCart = localStorage.getItem("cart_guest");
        if (guestCart) {
          try {
            cartItems = JSON.parse(guestCart);
          } catch (error) {
            console.error("Failed to parse guest cart:", error);
          }
        }
      }
      
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCurrentCartCount(totalItems);
    };

    updateCartCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Check periodically for changes (in case of same-tab updates)
    const interval = setInterval(updateCartCount, 1000);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search/${encodeURIComponent(query.trim())}`)
      setIsSearchOpen(false)
    }
  }

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData))
    setIsLoggedIn(true)
    setModalType(null)
  }

  const openLogin = () => setModalType("login")
  const openRegister = () => setModalType("register")
  const openForgot = () => setModalType("forgot")
  const closeModal = () => setModalType(null)

  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setIsUserMenuOpen(false)
    toast.success("User logged out successfully")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setIsSearchOpen(false)
    setIsUserMenuOpen(false)
    setIsCartOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
    setIsCartOpen(false)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    setIsCartOpen(false)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    setIsUserMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const menuItems = [
    { name: "Your Orders", path: "/order-history" },
    { name: "Diwali Diya", path: "/" },
    { name: "Frames", path: "/" },
    { name: "Combos", path: "/"},
    { name: "Cushions", path: "/" },
    { name: "Cutout Standy", path: "/" },
    { name: "Wallet", path: "/" },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" : "bg-white shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-[#007580] hover:text-[#005a63] transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#007580] to-[#005a63] rounded-xl flex items-center justify-center text-white text-lg sm:text-xl shadow-lg">
                🎁
              </div>
              <span className="hidden sm:block bg-gradient-to-r from-[#007580] to-[#005a63] bg-clip-text text-transparent">
                GiftGallery
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 mx-8 max-w-2xl">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search for gifts, frames, combos..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-3 pr-12 focus:outline-none focus:bg-white focus:border-[#007580] focus:shadow-lg transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Search className="text-gray-400 group-focus-within:text-[#007580] w-5 h-5 transition-colors duration-300" />
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden xl:flex items-center gap-1">
              {menuItems.slice(0, 5).map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#007580] rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                >
                  <span className="flex items-center space-x-1">
                    <span>{item.name}</span>
                  </span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#007580] group-hover:w-full transition-all duration-300"></div>
                </Link>
              ))}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#007580] rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <span>More</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  {menuItems.slice(5).map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:text-[#007580] hover:bg-gray-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Mobile Search */}
              <button
                onClick={toggleSearch}
                className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                  isSearchOpen
                    ? "bg-[#007580] text-white shadow-lg"
                    : "text-gray-700 hover:text-[#007580] hover:bg-gray-50"
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account */}
              <div className="relative">
                {isLoggedIn ? (
                  <button
                    onClick={toggleUserMenu}
                    className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      isUserMenuOpen
                        ? "bg-[#007580] text-white shadow-lg"
                        : "text-gray-700 hover:text-[#007580] hover:bg-gray-50"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Account</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <button
                    onClick={openLogin}
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-[#007580] hover:bg-gray-50 rounded-xl transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                  </button>
                )}

                {/* User Dropdown */}
                {isLoggedIn && (
                  <div
                    className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-300 transform z-50 ${
                      isUserMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
                    }`}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:text-[#007580] hover:bg-gray-50 transition-colors duration-200 rounded-t-xl"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:text-[#007580] hover:bg-gray-50 transition-colors duration-200"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 rounded-b-xl"
                    >
                      <X className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {/* Cart */}
              <div className="relative">
                <button
                  onClick={toggleCart}
                  className={`relative p-2 rounded-xl transition-all duration-300 group ${
                    isCartOpen 
                      ? "bg-[#007580] text-white shadow-lg" 
                      : "text-gray-700 hover:text-[#007580] hover:bg-gray-50"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  {currentCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {currentCartCount > 99 ? "99+" : currentCartCount}
                    </span>
                  )}
                </button>
                
                {/* Cart Dropdown */}
                <CartDropdown isOpen={isCartOpen} onClose={closeCart} />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className={`xl:hidden p-2 rounded-xl transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "bg-[#007580] text-white shadow-lg"
                    : "text-gray-700 hover:text-[#007580] hover:bg-gray-50"
                }`}
              >
                <div className="relative w-5 h-5">
                  <span
                    className={`absolute top-0 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  ></span>
                  <span
                    className={`absolute top-2 left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`absolute top-4 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
              isSearchOpen ? "max-h-20 pb-4" : "max-h-0"
            }`}
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for gifts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-3 pr-12 focus:outline-none focus:bg-white focus:border-[#007580] focus:shadow-lg transition-all duration-300 text-gray-700 placeholder-gray-400"
                autoFocus={isSearchOpen}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Search className="text-gray-400 group-focus-within:text-[#007580] w-5 h-5 transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`xl:hidden fixed inset-0 bg-black transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-50 visible" : "opacity-0 invisible"
          }`}
          style={{ top: scrolled ? "64px" : "80px" }}
          onClick={closeMobileMenu}
        ></div>

        {/* Mobile Menu */}
        <div
          className={`xl:hidden fixed left-0 right-0 bg-white border-t border-gray-100 shadow-2xl transition-all duration-500 ease-out transform ${
            isMobileMenuOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
          }`}
          style={{ top: scrolled ? "64px" : "80px" }}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Mobile User Section */}
            {isLoggedIn ? (
              <div className="mb-6 p-4 bg-gradient-to-r from-[#007580] to-[#005a63] rounded-2xl text-white">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Welcome back!</p>
                    <p className="text-sm opacity-90">Manage your account</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="flex-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-center text-sm font-medium transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={closeMobileMenu}
                    className="flex-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-center text-sm font-medium transition-colors duration-200"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-500/80 hover:bg-red-500 px-4 py-2 rounded-xl text-center text-sm font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                <p className="text-gray-600 mb-3">Join GiftGallery today!</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      openLogin()
                      closeMobileMenu()
                    }}
                    className="flex-1 bg-[#007580] hover:bg-[#005a63] text-white px-4 py-2 rounded-xl text-center text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      openRegister()
                      closeMobileMenu()
                    }}
                    className="flex-1 border-2 border-[#007580] text-[#007580] hover:bg-[#007580] hover:text-white px-4 py-2 rounded-xl text-center text-sm font-medium transition-colors duration-200"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-4 p-4 text-gray-700 hover:text-[#007580] hover:bg-gray-50 rounded-2xl transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="font-medium">{item.name}</span>
                  
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 lg:h-20"></div>

      {/* Modals */}
      {modalType === "login" && (
        <LoginModal
          setIsLoggedIn={setIsLoggedIn}
          onClose={closeModal}
          onSwitchToRegister={openRegister}
          onSwitchToForgot={openForgot}
        />
      )}

      {modalType === "register" && <RegisterModal onClose={closeModal} onSwitchToLogin={openLogin} />}

      {modalType === "forgot" && <ForgotPasswordModal onClose={closeModal} onSwitchToLogin={openLogin} />}
    </>
  )
}

export default Navbar

