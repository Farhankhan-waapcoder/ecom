import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

 return (
  <div
    onClick={() => navigate(`/product/${product.id}`)}
    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-gray-900/20 dark:hover:shadow-gray-900/30 transition-all duration-300 overflow-hidden group hover:-translate-y-2 cursor-pointer border border-gray-200 dark:border-gray-700"
  >
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-1">
      <div className="aspect-square w-full flex items-center justify-center h-40">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute top-1 right-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center gap-1 shadow-md">
        <Star className="w-3 h-3 text-yellow-400 fill-current" />
        <span className="text-xs font-semibold text-gray-900 dark:text-white">{product.rating}</span>
      </div>
    </div>
    
    <div className="p-3">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[2.5rem] leading-5">
        {product.name}
      </h3>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 dark:text-gray-400 line-through">{product.originalPrice}</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // stop click bubbling
            onAddToCart(product);
          }}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-500 dark:to-purple-600 dark:hover:from-purple-600 dark:hover:to-purple-700 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl dark:shadow-gray-900/20 dark:hover:shadow-gray-900/30 group-hover:animate-pulse"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);
}