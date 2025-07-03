"use client"

import { useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import allProducts from "../data/products.js"
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';
export default function ReviewSection({ onSubmit, onBack, formData }) {
  const { id } = useParams()
  const productId = parseInt(id)
  const product = allProducts.find((item) => item.id === productId)
  const navigate = useNavigate();
const handleSubmit = (e) => {
  e.preventDefault();

  // Prepare order object
  const newOrder = {
    id: Date.now(), // unique id for order
    productId: product.id,
    productName: product.name,
    productImage: product.image,
    productPrice: product.price,
    orderDate: new Date().toISOString(),
    customerInfo: formData,
  };

  // Get existing orders or create new array
  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

  // Add new order to list
  const updatedOrders = [...existingOrders, newOrder];

  // Save to localStorage
  localStorage.setItem("orders", JSON.stringify(updatedOrders));
  toast.success("order placed");
  navigate("/order-history"); 
  // Redirect or show confirmation
  onSubmit(newOrder);
};


  if (!product) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-red-500">Product not found.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>

      <div className="space-y-6">
        {/* Customer Information */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-600">Name:</span><span className="ml-2 text-gray-900">{formData.firstName} {formData.lastName}</span></div>
            <div><span className="text-gray-600">Email:</span><span className="ml-2 text-gray-900">{formData.email}</span></div>
            <div><span className="text-gray-600">Phone:</span><span className="ml-2 text-gray-900">+91 {formData.phone}</span></div>
            <div><span className="text-gray-600">WhatsApp Updates:</span><span className="ml-2 text-gray-900">{formData.whatsappUpdates ? "Yes" : "No"}</span></div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Delivery Information</h3>
          <div className="text-sm">
            <div className="mb-2">
              <span className="text-gray-600">Address:</span>
              <span className="ml-2 text-gray-900">{formData.address}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><span className="text-gray-600">City:</span><span className="ml-2 text-gray-900">{formData.city}</span></div>
              <div><span className="text-gray-600">State:</span><span className="ml-2 text-gray-900">{formData.state}</span></div>
              <div><span className="text-gray-600">PIN Code:</span><span className="ml-2 text-gray-900">{formData.pincode}</span></div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">Quantity: 1</p>
            </div>
            <div className="text-lg font-semibold text-gray-900">{product.price}</div>
          </div>
        </div>

        {/* Buttons */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Delivery Info</span>
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
