import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";

export default function HorizontalProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  return (
  <div
    onClick={() => navigate(`/product/${product.id}`)}
    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-[1.02] cursor-pointer"
  >
    <div className="flex flex-col sm:flex-row">
      {/* Product Image */}
      <div className="sm:w-48 w-full h-48 sm:h-auto flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Details */}
      <div className="flex-1 p-6 relative">
        {/* Rating badge */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-700/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold text-gray-800 dark:text-white">
            {product.rating}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Brand & Category */}
        <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 dark:text-gray-300">
          <span>{product.brand}</span>
          <span className="text-gray-400 dark:text-gray-500">•</span>
          <span>{product.category}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {product.price}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Stock Info */}
        {product.stock > 0 && (
          <div className="mt-2">
            <span className="text-sm text-green-600 dark:text-green-400">
              In Stock ({product.stock})
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

}
