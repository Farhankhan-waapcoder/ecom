import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Listings from "./pages/Listings.jsx";
import { Toaster } from 'react-hot-toast';
import Cart from "./pages/Cart.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Navbar from "./components/Navbar.jsx";
import WishList from "./pages/WIshList.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Footer from "./components/Footer.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import CancellationRefund from "./pages/CancellationRefund.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";
import ShippingDelivery from "./pages/ShippingDelivery.jsx";
import Privacy from "./pages/Privacy.jsx";
import ScrollToTop from "./components/ScrollTOTop.jsx";
import Search from "./pages/Search.jsx";
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
       <ScrollToTop />
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
        <Route path="/not-found" element={<PageNotFound />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/cancellation-refund" element={<CancellationRefund />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/shipping-delivery" element={<ShippingDelivery />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/search/:query" element={<Search />} />
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
      <Footer/>
    </Router>
  );
}
