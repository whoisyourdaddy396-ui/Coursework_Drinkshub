// Environment configuration
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // App Configuration
  APP_NAME: 'DrinksHub',
  APP_VERSION: '1.0.0',
  
  // Feature flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  
  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Local storage keys
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER: 'user',
    CART: 'cart',
    AGE_VERIFIED: 'ageVerified',
    THEME: 'theme',
  },
  
  // Routes
  ROUTES: {
    HOME: '/',
    PRODUCTS: '/products',
    CART: '/cart',
    CHECKOUT: '/checkout',
    LOGIN: '/login',
    CONTACT: '/contact',
    ADMIN: '/admin',
  },
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
    },
    PRODUCTS: {
      LIST: '/products',
      DETAIL: '/products/:id',
      SEARCH: '/products/search',
      CATEGORY: '/products/category/:category',
    },
    ORDERS: {
      LIST: '/orders',
      DETAIL: '/orders/:id',
      USER_ORDERS: '/orders/user',
      STATUS: '/orders/:id/status',
    },
    HEALTH: '/health',
  },
};

export default config; 