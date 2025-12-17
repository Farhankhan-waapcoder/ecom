import axios from 'axios';

// Create a separate axios instance for FakeStoreAPI (since it doesn't need auth)
const fakeStoreApi = axios.create({
  baseURL: import.meta.env.VITE_FAKE_STORE_API_URL || 'https://fakestoreapi.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for Admin Ecommerce API using proxy
const adminApi = axios.create({
  baseURL: '/api', // Use proxy route instead of direct URL
  headers: {
    'Content-Type': 'application/json', 
  },
});

// Add an interceptor to handle authentication
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
adminApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// PRODUCTS API CALLS

export const productAPI = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await fakeStoreApi.get('/products');
      return {
        success: true,
        data: response.data,
        message: 'Products fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch products'
      };
    }
  },

  // Get products with pagination from new API
  getProductsPaginated: async (page = 1, pageSize = 12, sort = 'newest') => {
    try {
      const response = await adminApi.get(`/v1/Products?page=${page}&pageSize=${pageSize}&sort=${sort}`);
      return {
        success: response.data.success,
        data: response.data.data.data,
        pagination: {
          page: response.data.data.page,
          pageSize: response.data.data.pageSize,
          totalPages: response.data.data.totalPages
        },
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch paginated products'
      };
    }
  },

  // Get products with limit
  getProductsWithLimit: async (limit = 5) => {
    try {
      const response = await fakeStoreApi.get(`/products?limit=${limit}`);
      return {
        success: true,
        data: response.data,
        message: `Top ${limit} products fetched successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch limited products'
      };
    }
  },

  // Get products sorted
  getProductsSorted: async (sort = 'desc') => {
    try {
      const response = await fakeStoreApi.get(`/products?sort=${sort}`);
      return {
        success: true,
        data: response.data,
        message: `Products sorted ${sort} fetched successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch sorted products'
      };
    }
  },

  // Get single product
  getProductById: async (id) => {
    try {
      const response = await fakeStoreApi.get(`/products/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Product fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch product'
      };
    }
  },

  // Get product details by ID from new API
  getProductDetails: async (id) => {
    try {
      const response = await adminApi.get(`/v1/Products/${id}`);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch product details'
      };
    }
  },

  // Get products by category ID
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await adminApi.get(`/v1/Products/category/${categoryId}`);
      return {
        success: true,
        data: response.data,
        message: 'Products fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch products by category'
      };
    }
  },
};

// CATEGORIES API CALLS

export const categoryAPI = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await fakeStoreApi.get('/products/categories');
      return {
        success: true,
        data: response.data,
        message: 'Categories fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch categories'
      };
    }
  },

  // Get categories from new API
  getCategoriesFromAPI: async () => {
    try {
      const response = await adminApi.get('/v1/Categories');
      return {
        success: true,
        data: response.data,
        message: 'Categories fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch categories'
      };
    }
  },

  // Get subcategories by category ID
  getSubCategories: async (categoryId) => {
    try {
      const response = await adminApi.get(`/v1/Categories/${categoryId}/subcategories`);
      return {
        success: true,
        data: response.data,
        message: 'Subcategories fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch subcategories'
      };
    }
  },

  // Get category tree with hierarchy
  getCategoryTree: async (activeOnly = true) => {
    try {
      const response = await adminApi.get(`/v1/Categories/tree?activeOnly=${activeOnly}`);
      return {
        success: true,
        data: response.data,
        message: 'Category tree fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch category tree'
      };
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await fakeStoreApi.get(`/products/category/${category}`);
      return {
        success: true,
        data: response.data,
        message: `Products from ${category} category fetched successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch products by category'
      };
    }
  }
};

// CART API CALLS

export const cartAPI = {
  // Get current user's cart
  getCart: async () => {
    try {
      const response = await adminApi.get('/v1/cart');
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Cart fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to fetch cart'
      };
    }
  },

  // Get cart item count
  getCartCount: async () => {
    try {
      const response = await adminApi.get('/v1/cart/count');
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Cart count fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to fetch cart count'
      };
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, variantId = null) => {
    try {
      const response = await adminApi.post('/v1/cart/add', {
        productId,
        quantity,
        ...(variantId && { variantId })
      });
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Item added to cart successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to add item to cart'
      };
    }
  },

  // Update cart item quantity
  updateCartItem: async (productId, quantity) => {
    try {
      const response = await adminApi.put(`/v1/cart/update/${productId}`, {
        quantity
      });
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Cart item updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to update cart item'
      };
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      const response = await adminApi.delete(`/v1/cart/remove/${productId}`);
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Item removed from cart successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to remove item from cart'
      };
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await adminApi.delete('/v1/cart/clear');
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Cart cleared successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to clear cart'
      };
    }
  },

  // Apply coupon code to cart
  applyCoupon: async (couponCode) => {
    try {
      const response = await adminApi.post('/v1/cart/apply-coupon', {
        couponCode
      });
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Coupon applied successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to apply coupon'
      };
    }
  },

  // Remove coupon from cart
  removeCoupon: async () => {
    try {
      const response = await adminApi.post('/v1/cart/remove-coupon');
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Coupon removed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to remove coupon'
      };
    }
  }
};

// AUTH API CALLS (using your original API)

export const authAPI = {
  // Login user with email and password
  login: async (email, password, twoFactorCode = null) => {
    try {
      const response = await adminApi.post('/v1/auth/login', { 
        email, 
        password,
        ...(twoFactorCode && { twoFactorCode })
      });
      
      // Store token if login successful
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Register a new user account
  register: async (formData) => {
    try {
      const response = await adminApi.post('/v1/auth/register', {
        userName: formData.userName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber,
        role: 'user', // Always use 'user' role for frontend registration
        acceptTerms: formData.acceptTerms,
        acceptPrivacy: formData.acceptPrivacy
      });
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Registration successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Refresh access token using refresh token
  refreshToken: async (refreshToken) => {
    try {
      const token = refreshToken || localStorage.getItem('refreshToken');
      const response = await adminApi.post('/v1/auth/refresh-token', { refreshToken: token });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to refresh token'
      };
    }
  },

  // Logout user (clears authentication cookie)
  logout: async () => {
    try {
      const response = await adminApi.post('/v1/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: true,
        data: response.data,
        message: 'Logged out successfully'
      };
    } catch (error) {
      // Still clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Logout completed locally'
      };
    }
  },

  // Validate current JWT token
  validateToken: async () => {
    try {
      const response = await adminApi.post('/v1/auth/validate-token');
      return {
        success: true,
        data: response.data,
        message: 'Token is valid'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Token is invalid'
      };
    }
  },

  // Change password (requires authentication)
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await adminApi.post('/v1/auth/password/change', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Password changed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to change password'
      };
    }
  },

  // Verify password (for sensitive operations)
  verifyPassword: async (password) => {
    try {
      const response = await adminApi.post('/v1/auth/password/verify', { password });
      
      return {
        success: true,
        data: response.data,
        message: 'Password verified successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Password verification failed'
      };
    }
  },

  // Request password reset (forgot password)
  forgotPassword: async (email) => {
    try {
      const response = await adminApi.post('/v1/auth/password/forgot', { email });
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to send reset email'
      };
    }
  },

  // Reset password with token (from email)
  resetPassword: async (email, token, newPassword, confirmPassword) => {
    try {
      const response = await adminApi.post('/v1/auth/password/reset', {
        email,
        token,
        newPassword,
        confirmPassword
      });
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Password reset successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to reset password'
      };
    }
  },

  // Verify password reset token validity
  verifyResetToken: async (email, token) => {
    try {
      const response = await adminApi.post('/v1/auth/password/verify-reset-token', {
        email,
        token
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Token is valid'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Invalid or expired token'
      };
    }
  },

  // Send email verification link
  sendVerificationEmail: async (email) => {
    try {
      const response = await adminApi.post('/v1/auth/email/send-verification', { email });
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Verification email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to send verification email'
      };
    }
  },

  // Verify email address with token
  verifyEmail: async (email, token) => {
    try {
      const response = await adminApi.post('/v1/auth/email/verify', {
        email,
        token
      });
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Email verified successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Email verification failed'
      };
    }
  },

  // Setup two-factor authentication (returns QR code)
  setup2FA: async () => {
    try {
      const response = await adminApi.post('/v1/auth/2fa/setup');
      
      return {
        success: true,
        data: response.data,
        message: '2FA setup initiated'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to setup 2FA'
      };
    }
  },

  // Confirm and enable two-factor authentication
  confirm2FA: async (code) => {
    try {
      const response = await adminApi.post('/v1/auth/2fa/confirm', { code });
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || '2FA enabled successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to confirm 2FA'
      };
    }
  },

  // Disable two-factor authentication
  disable2FA: async (password) => {
    try {
      const response = await adminApi.post('/v1/auth/2fa/disable', { password });
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || '2FA disabled successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to disable 2FA'
      };
    }
  },

  // Get backup codes for two-factor authentication
  get2FABackupCodes: async () => {
    try {
      const response = await adminApi.get('/v1/auth/2fa/backup-codes');
      
      return {
        success: true,
        data: response.data,
        message: 'Backup codes retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to get backup codes'
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get current user token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  }
};

// ======================
// UTILITY FUNCTIONS
// ======================

export const utilityAPI = {
  // Generic API call function
  makeApiCall: async (method, endpoint, data = null) => {
    try {
      const config = {
        method,
        url: endpoint,
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.data = data;
      }

      const response = await fakeStoreApi(config);
      return {
        success: true,
        data: response.data,
        message: `${method} request successful`
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: `${method} request failed`
      };
    }
  },

  // Test API connection
  testConnection: async () => {
    try {
      const response = await fakeStoreApi.get('/products?limit=1');
      return {
        success: true,
        data: response.status,
        message: 'API connection successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'API connection failed'
      };
    }
  }
};

// CHECKOUT API CALLS

export const checkoutAPI = {
  // Get order summary with selected addresses and payment method
  getSummary: async (checkoutData) => {
    try {
      const response = await adminApi.post('/v1/checkout/summary', checkoutData);
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Order summary fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to fetch order summary'
      };
    }
  },

  // Validate checkout data before processing
  validateCheckout: async (checkoutData) => {
    try {
      const response = await adminApi.post('/v1/checkout/validate', checkoutData);
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Checkout data validated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Checkout validation failed'
      };
    }
  },

  // Apply coupon code to checkout
  applyCoupon: async (couponCode) => {
    try {
      const response = await adminApi.post('/v1/checkout/apply-coupon', {
        couponCode
      });
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Coupon applied successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to apply coupon'
      };
    }
  },

  // Process checkout (create order and process payment)
  processCheckout: async (checkoutData) => {
    try {
      const response = await adminApi.post('/v1/checkout/process', checkoutData);
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Checkout processed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to process checkout'
      };
    }
  },

  // Get available shipping options
  getShippingOptions: async () => {
    try {
      const response = await adminApi.get('/v1/checkout/shipping-options');
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Shipping options fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to fetch shipping options'
      };
    }
  }
};

// ORDER API CALLS

export const orderAPI = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await adminApi.post('/v1/Orders', {
        items: orderData.items, // Array of { productId, quantity }
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        shippingCost: orderData.shippingCost || 0,
        notes: orderData.notes || ''
      });
      
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Order created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to create order'
      };
    }
  },

  // Get user's orders
  getOrders: async () => {
    try {
      const response = await adminApi.get('/v1/Orders');
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Orders fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  },

  // Get user's orders with pagination
  getMyOrders: async (page = 1, pageSize = 10) => {
    try {
      const response = await adminApi.get(`/v1/Orders/my-orders?page=${page}&pageSize=${pageSize}`);
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data?.data || response.data.data || response.data,
        pagination: {
          page: response.data.data?.page || page,
          pageSize: response.data.data?.pageSize || pageSize,
          total: response.data.data?.total || 0
        },
        message: response.data.message || 'Orders retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await adminApi.get(`/v1/Orders/${orderId}`);
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Order fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to fetch order'
      };
    }
  }
};

// WISHLIST API CALLS

export const wishlistAPI = {
  // Add product to wishlist
  addToWishlist: async (productId) => {
    try {
      const response = await adminApi.post(`/v1/wishlist/add/${productId}`);
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Product added to wishlist'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to add to wishlist'
      };
    }
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId) => {
    try {
      const response = await adminApi.delete(`/v1/wishlist/remove/${productId}`);
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Product removed from wishlist'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to remove from wishlist'
      };
    }
  },

  // Get user's wishlist
  getWishlist: async () => {
    try {
      const response = await adminApi.get('/v1/wishlist');
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Wishlist fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to fetch wishlist'
      };
    }
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    try {
      const response = await adminApi.delete('/v1/wishlist/clear');
      return {
        success: response.data.success !== undefined ? response.data.success : true,
        data: response.data.data || response.data,
        message: response.data.message || 'Wishlist cleared successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Failed to clear wishlist'
      };
    }
  }
};

// Export everything as default
export default {
  productAPI,
  categoryAPI,
  cartAPI,
  authAPI,
  checkoutAPI,
  orderAPI,
  wishlistAPI,
  utilityAPI,
};

// Export both API instances
export { fakeStoreApi, adminApi };