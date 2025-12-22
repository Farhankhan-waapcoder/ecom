import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { categoryAPI } from "../services/Api.js";
import { ArrowLeft, Grid, List, ChevronRight } from 'lucide-react';

export default function SubCategories() {
  const { slug } = useParams();  // Changed from categoryId to slug
  const navigate = useNavigate();
  
  const [subCategories, setSubCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!slug) {
        setError("Category slug not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First, fetch all categories to get parent category info by slug
        const categoriesResult = await categoryAPI.getCategoriesFromAPI();
        if (categoriesResult.success) {
          const parentCat = categoriesResult.data.find(cat => cat.slug === slug);
          if (parentCat) {
            setParentCategory({
              id: parentCat.id,
              name: parentCat.name,
              description: parentCat.description,
              image: parentCat.imageUrl || parentCat.iconUrl
            });
            
            // Fetch subcategories using the found ID
            const result = await categoryAPI.getSubCategories(parentCat.id);
            
            if (result.success && result.data) {
              // Filter only active subcategories
              const activeSubCategories = result.data
                .filter(subCat => subCat.isActive)
                .sort((a, b) => a.displayOrder - b.displayOrder);
              
              setSubCategories(activeSubCategories);
            } else {
              throw new Error(result.message || 'Failed to fetch subcategories');
            }
          } else {
            throw new Error('Category not found');
          }
        }
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setError("Failed to load subcategories");
        toast.error("Failed to load subcategories");
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [slug]);  // Changed dependency from categoryId to slug

  const handleSubCategoryClick = (subCategory) => {
    // Navigate to category page with subcategory filter
    navigate(`/category/${subCategory.slug}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-8">
          {/* Back button skeleton */}
          <div className="mb-6 animate-pulse">
            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
          
          {/* Header skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-10 w-64 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="h-6 w-96 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-600 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {parentCategory?.name || 'Subcategories'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore all subcategories under {parentCategory?.name || 'this category'}
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {subCategories.length} {subCategories.length === 1 ? 'Subcategory' : 'Subcategories'}
            </span>
          </div>
        </div>

        {/* Subcategories Display */}
        {subCategories.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              No Subcategories Available
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This category doesn't have any subcategories yet.
            </p>
            <button
              onClick={handleBack}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subCategories.map((subCategory) => (
              <div
                key={subCategory.id}
                onClick={() => handleSubCategoryClick(subCategory)}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                  <img
                    src={subCategory.imageUrl || subCategory.iconUrl || '/placeholder-category.jpg'}
                    alt={subCategory.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/placeholder-category.jpg';
                    }}
                  />
                  {subCategory.isFeatured && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {subCategory.name}
                  </h3>
                  {subCategory.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {subCategory.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {subCategory.productCount} {subCategory.productCount === 1 ? 'Product' : 'Products'}
                    </span>
                    <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {subCategories.map((subCategory) => (
              <div
                key={subCategory.id}
                onClick={() => handleSubCategoryClick(subCategory)}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex"
              >
                {/* Image */}
                <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                  <img
                    src={subCategory.imageUrl || subCategory.iconUrl || '/placeholder-category.jpg'}
                    alt={subCategory.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/placeholder-category.jpg';
                    }}
                  />
                  {subCategory.isFeatured && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {subCategory.name}
                    </h3>
                    {subCategory.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {subCategory.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {subCategory.productCount} {subCategory.productCount === 1 ? 'Product' : 'Products'}
                    </span>
                    <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
