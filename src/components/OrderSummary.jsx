import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function OrderSummary() {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("")
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)

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

  const handleApplyCoupon = () => {
    console.log("Applying coupon:", couponCode)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
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
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>

    {/* Cart Items */}
    <div className="space-y-3 mb-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      {cartItems.map((item) => (
        <div key={item.id} className="flex gap-3 items-start text-sm border-b border-gray-100 dark:border-gray-700 pb-3">
          {/* Product Image */}
          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/64?text=No+Image';
              }}
            />
          </div>
          
          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 dark:text-white font-medium line-clamp-2">{item.name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              ${parseFloat(item.price).toFixed(2)} × {item.quantity}
            </p>
          </div>
          
          {/* Price */}
          <span className="text-gray-900 dark:text-white font-semibold flex-shrink-0">
            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})</span>
        <span className="text-gray-900 dark:text-white">${calculateSubtotal()}</span>
      </div>
    </div>

    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter Coupon/Discount Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <button
          onClick={handleApplyCoupon}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          APPLY
        </button>
      </div>
    </div>

    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="flex justify-between text-lg font-semibold">
        <span className="text-gray-900 dark:text-white">Order Total</span>
        <span className="text-gray-900 dark:text-white">${calculateSubtotal()}</span>
      </div>
    </div>

    {/* Payment Security Icons */}
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-center gap-2 opacity-60">
        <div className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-white px-2 py-1 rounded">PCI DSS</div>
        <div className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-white px-2 py-1 rounded">MasterCard</div>
        <div className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-white px-2 py-1 rounded">RuPay</div>
        <div className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-white px-2 py-1 rounded">VISA</div>
        <div className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-white px-2 py-1 rounded">SafeKey</div>
        <div className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-white px-2 py-1 rounded">UPI</div>
      </div>
      <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>🚚 FASTER DELIVERY</span>
      </div>
    </div>
  </div>
)

}
