/**
 * Products, Second Products, Cart, and Favorites Data Management
 */

// Base URL for assets
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? '' 
  : window.location.origin;

// Cache Configuration
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const CACHE_KEYS = {
  PRODUCTS: 'Products',
  SECOND_PRODUCTS: 'Second_Products',
  CART: 'Cart_Products',
  FAVORITES: 'Favorites_Products',
  CACHE_TIMESTAMP: 'products_cache_timestamp'
};

// Product data validation
const validateProduct = (product) => {
  return product 
    && typeof product === 'object'
    && typeof product.id === 'number'
    && typeof product.name === 'string'
    && typeof product.price === 'number'
    && typeof product.Image === 'string'
    && typeof product.quantity === 'number';
};

// Safe storage operations with validation
const safeGetFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    const parsed = JSON.parse(data);
    
    // Validate data structure based on key
    if (key === CACHE_KEYS.CART || key === CACHE_KEYS.PRODUCTS || key === CACHE_KEYS.SECOND_PRODUCTS) {
      if (!Array.isArray(parsed)) return defaultValue;
      return parsed.filter(validateProduct);
    }
    return parsed;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return defaultValue;
  }
};

const safeSetToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    return false;
  }
};

// Cart state management
let Cart_Products = safeGetFromStorage(CACHE_KEYS.CART, []);

const addToCart = (product) => {
  try {
    if (!validateProduct(product)) {
      throw new Error('Invalid product format');
    }

    const existingProductIndex = Cart_Products.findIndex(p => p.id === product.id);
    if (existingProductIndex >= 0) {
      Cart_Products[existingProductIndex].quantity += 1;
    } else {
      Cart_Products.push({ ...product, quantity: 1 });
    }

    safeSetToStorage(CACHE_KEYS.CART, Cart_Products);
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { 
        products: Cart_Products,
        total: calculateCartTotal(),
        count: Cart_Products.length
      }
    }));
    
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

const removeFromCart = (productId) => {
  try {
    Cart_Products = Cart_Products.filter(p => p.id !== productId);
    safeSetToStorage(CACHE_KEYS.CART, Cart_Products);
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { 
        products: Cart_Products,
        total: calculateCartTotal(),
        count: Cart_Products.length
      }
    }));
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
};

const updateCartQuantity = (productId, quantity) => {
  try {
    if (quantity < 1 || quantity > 99) return false;
    
    const productIndex = Cart_Products.findIndex(p => p.id === productId);
    if (productIndex === -1) return false;
    
    Cart_Products[productIndex].quantity = quantity;
    safeSetToStorage(CACHE_KEYS.CART, Cart_Products);
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { 
        products: Cart_Products,
        total: calculateCartTotal(),
        count: Cart_Products.length
      }
    }));
    return true;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return false;
  }
};

const calculateCartTotal = () => {
  return Cart_Products.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Products state management
const initializeProducts = async () => {
  try {
    // First try to load from cache
    let products = safeGetFromStorage(CACHE_KEYS.PRODUCTS, MyProducts);
    let secondProducts = safeGetFromStorage(CACHE_KEYS.SECOND_PRODUCTS, MySecondProducts);
    
    // Fix image paths
    products = products.map(product => ({
      ...product,
      Image: product.Image.startsWith('http') ? 
        product.Image : 
        `${BASE_URL}/${product.Image.replace(/^\//, '')}`
    }));
    
    secondProducts = secondProducts.map(product => ({
      ...product,
      Image: product.Image.startsWith('http') ? 
        product.Image : 
        `${BASE_URL}/${product.Image.replace(/^\//, '')}`
    }));
    
    // Save back to storage with fixed paths
    safeSetToStorage(CACHE_KEYS.PRODUCTS, products);
    safeSetToStorage(CACHE_KEYS.SECOND_PRODUCTS, secondProducts);
    
    // Dispatch events
    window.dispatchEvent(new CustomEvent('productsLoaded', { 
      detail: { products, secondProducts } 
    }));
    
    return { products, secondProducts };
  } catch (error) {
    console.error('Error initializing products:', error);
    return { 
      products: MyProducts, 
      secondProducts: MySecondProducts 
    };
  }
};

// Export functions and initialize
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.getCartProducts = () => Cart_Products;
window.calculateCartTotal = calculateCartTotal;

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeProducts);
