import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Listings from "./pages/Listings.jsx";
import { Toaster } from 'react-hot-toast';
import Cart from "./pages/Cart.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Navbar from "./components/Navbar.jsx"; // New reusable menu component
import './styles.css';
export default function App() {
  const [currentUser,setCurrentUser]=useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
    setCurrentUser(user);
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Listings isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} currentUser={currentUser}/>} />
        {
         <Route path="/my-cart" element={<Cart />} />
        }
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </Router>
  );
}
