import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminApi, productAPI } from '../services/Api';
import { Filter, X, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import HorizontalProductCard from '../components/HorizontalProductCard.jsx';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

export default function Category() {
  const { slug } = useParams(); // Use slug from route
  const [categoryData, setCategoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 2000],
    rating: 0,
    inStock: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch category data and filter products
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (slug) {
          // Fetch products by category slug using public API
          const result = await productAPI.getProductsByCategorySlug(slug, sortBy, 1, 50);
          
          if (result.success && result.data) {
            // Set category info
            if (result.data.category) {
              setCategoryData({
                categoryName: result.data.category.name,
                categoryImage: result.data.category.imageUrl || '/placeholder-category.jpg',
                description: result.data.category.description
              });
            }
            
            // Format products from the API
            const formattedProducts = result.data.data.map(product => ({
              id: product.id || product.productId,
              title: product.name,
              price: product.sellingPrice / 100, // Convert cents to dollars
              originalPrice: product.basePrice !== product.sellingPrice ? product.basePrice / 100 : null,
              discount: product.discountPercentage || 0,
              image: product.imageUrls && product.imageUrls.length > 0 
                ? product.imageUrls[0]
                : product.primaryImageUrl || '/placeholder-product.jpg',
              brand: product.brandName || product.vendorName || 'No Brand',
              category: product.categoryName || result.data.category?.name || 'Category',
              rating: product.averageRating || 0,
              ratingCount: product.totalReviews || 0,
              stock: product.stockQuantity || 0,
              isOnSale: product.isOnSale,
              description: product.shortDescription || product.description,
              sku: product.sku
            }));
            
            setProducts(formattedProducts);
            setFilteredProducts(formattedProducts);
          } else {
            throw new Error(result.message || 'Failed to fetch products');
          }
        } else {
          setError('Category not found');
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error);
        setError('Failed to fetch category data');
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, sortBy]);

  // Get unique brands from the category's products
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  // Filter logic
  useEffect(() => {
    let filtered = [...products];

    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }

    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredProducts(filtered);
  }, [filters, sortBy, products]);

  const handleBrandChange = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      priceRange: [prev.priceRange[0], value]
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      priceRange: [0, 2000],
      rating: 0,
      inStock: false
    });
  };

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Category Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-16 lg:top-20 z-40">
        {/* Breadcrumb Section */}
        <div className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-6 py-2">
            <nav className="flex items-center space-x-1 text-sm">
              <Link to="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200">
                Home
              </Link>
              <span className="text-gray-400 dark:text-gray-500 mx-2">›</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium capitalize">
                {categoryData?.categoryName || (slug ? slug.replace(/-/g, ' ') : 'Category')}
              </span>
            </nav>
          </div>
        </div>
        
        {/* Header Content */}
  <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {categoryData?.categoryName || (slug ? slug.replace(/-/g, ' ') : 'Category')} Products
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {loading ? 'Loading...' : `${filteredProducts.length} products found`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  <Grid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>


              <button onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
  <div className="container mx-auto px-6 py-3">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80">
            <FilterSidebar filters={filters} setFilters={setFilters} uniqueBrands={uniqueBrands} />
          </div>

          {/* Mobile Filter */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 dark:bg-opacity-60">
              <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                    <button onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FilterSidebar filters={filters} setFilters={setFilters} uniqueBrands={uniqueBrands} />
                </div>
              </div>
            </div>
          )}

          {/* Product Listing */}
          <div className="flex-1">
            {loading ?(
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-600 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )  : error ? (
              <div className="text-center py-12 text-red-600 dark:text-red-400">{error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map(product =>
                  viewMode === 'grid'
                    ? <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                    : <HorizontalProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
