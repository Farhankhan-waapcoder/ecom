import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';

export default function ProductSlider({ products, title, onAddToCart }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [products.length, isAutoPlay]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  return (
    <div className="relative mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          <button onClick={goToPrevious} className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={goToNext} className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full flex-shrink-0 cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="text-white">
                    <h3 className="text-2xl md:text-4xl font-bold mb-4">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-400 font-semibold">{product.rating}</span>
                    </div>
                    <p className="text-3xl font-bold mb-6">{product.price}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent navigating to detail page
                        onAddToCart(product);
                      }}
                      className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-purple-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
