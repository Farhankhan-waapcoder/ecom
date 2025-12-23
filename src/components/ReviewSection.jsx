"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';
import { orderAPI } from '../services/Api';

export default function ReviewSection({ onSubmit, onBack, formData }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const savedCart = localStorage.getItem(`cart_${parsedUser.email}`);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to parse cart:", error);
          setCartItems([]);
        }
      }
    } else {
      const guestCart = localStorage.getItem("cart_guest");
      if (guestCart) {
        try {
          setCartItems(JSON.parse(guestCart));
        } catch (error) {
          console.error("Failed to parse guest cart:", error);
          setCartItems([]);
        }
      }
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!user) {
      toast.error("Please login to place an order");
      return;
    }

    setIsSubmitting(true);

    try {
      // Construct shipping and billing addresses from formData
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      const billingAddress = shippingAddress; // Same as shipping for now

      // Prepare order data for API
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        shippingCost: 0,
        notes: `Customer: ${formData.firstName} ${formData.lastName}, Email: ${formData.email}, Phone: ${formData.phone}`
      };

      // Call API to create order
      const result = await orderAPI.createOrder(orderData);

      if (result.success) {
        // Save order to localStorage for order history
        const localOrder = {
          id: result.data.orderId,
          items: cartItems.map(item => ({
            productId: item.id,
            productName: item.name,
            productImage: item.image,
            productPrice: item.price,
            quantity: item.quantity
          })),
          totalAmount: result.data.totalAmount / 100, // Convert from cents to dollars
          orderDate: new Date().toISOString(),
          customerInfo: formData,
          status: "Pending",
          apiOrderId: result.data.orderId
        };

        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const updatedOrders = [...existingOrders, localOrder];
        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        // Clear the cart after successful order
        const key = user ? `cart_${user.email}` : "cart_guest";
        localStorage.removeItem(key);

        toast.success(result.message || "Order placed successfully!");
        navigate("/orders");
        onSubmit(localOrder);
      } else {
        throw new Error(result.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[#007580] text-white rounded-lg hover:bg-[#006570] transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

return (
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Review Your Order</h2>

    <div className="space-y-6">
      {/* Customer Information */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Name:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{formData.firstName} {formData.lastName}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{formData.email}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
            <span className="ml-2 text-gray-900 dark:text-white">+91 {formData.phone}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">WhatsApp Updates:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{formData.whatsappUpdates ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Delivery Information</h3>
        <div className="text-sm">
          <div className="mb-2">
            <span className="text-gray-600 dark:text-gray-400">Address:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{formData.address}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-600 dark:text-gray-400">City:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{formData.city}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">State:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{formData.state}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">PIN Code:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{formData.pincode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Order Items</h3>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                }}
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                </p>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          
          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
            <span className="text-xl font-bold text-[#007580] dark:text-[#38b2ac]">${calculateTotal()}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Delivery Info</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)
}