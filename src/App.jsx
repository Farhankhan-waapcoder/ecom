import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Listings from "./pages/Listings.jsx";
import { Toaster } from 'react-hot-toast';
import Cart from "./pages/Cart.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Navbar from "./components/Navbar.jsx";
import './styles.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser.email); // or `parsedUser` if you need full object
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Failed to parse user:", err);
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    }
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route
          path="/"
          element={
            <Listings
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              currentUser={currentUser}
            />
          }
        />
        <Route path="/my-cart" element={<Cart />} />
        <Route
          path="/product/:id"
          element={
            <ProductPage
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
            />
          }
        />
      </Routes>
    </Router>
  );
}
