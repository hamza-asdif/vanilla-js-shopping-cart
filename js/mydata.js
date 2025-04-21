/****
 ** Products, Cart, and Favorites Data Management
 * *Simplified version for better reliability
 */

// !!! Default product data
const defaultProducts = [
  {
    id: 1,
    name: "ساعة اليد الفاخرة ONOLA Watch الأكثر مبيعا في المملكة - إصدار محدود",
    Image: "images/products/watch.jpeg",
    price: 349,
    quantity: 1,
  },
  {
    id: 2,
    name: "جهاز تبريد مقعد السيارة الذكي Magnetic Fan Car الأكثر مبيعا في العالم",
    Image: "images/new-products/car-product.jpeg",
    price: 349,
    quantity: 1,
  },
  {
    id: 3,
    name: "الشاحن العجيب Three Port Charger الأكثر مبيعا في العالم",
    Image: "images/new-products/charger.jpeg",
    price: 349,
    quantity: 1,
  },
  {
    id: 4,
    name: "غسالة الأكواب الأتوماتيكية Rinser الأكثر مبيعا في شهر رمضان",
    Image: "images/products/rinser-cuisine.jpeg",
    price: 349,
    quantity: 1,
  },
  {
    id: 5,
    name: "الأكثر طلبًا عند النساء حقيبة الماكياج الفاخرة Vergi",
    Image: "images/products/vergi%20sac.jpeg",
    price: 180,
    quantity: 1,
  },
  {
    id: 6,
    name: "مصحح قوام الجسم Shapewear الأصلي و الأكثر مبيعا في العالم",
    Image: "images/products/shapeware.jpeg",
    price: 199,
    quantity: 1,
  },
  {
    id: 7,
    name: "المصباح الكرستالي الأنيق Carluxy الجديد لسنة 2023",
    Image: "images/products/crystal.webp",
    price: 309,
    quantity: 1,
  },
  {
    id: 8,
    name: "منعم بشرة الأقدام الأصلي Marlo-X الأكثر مبيعا في العالم",
    Image: "images/products/marlox.webp",
    price: 199,
    quantity: 1,
  },
];

// !!! Storage key constants
const STORAGE_KEYS = {
  PRODUCTS: "Products",
  CART: "Cart_Products",
  FAVORITES: "Favorites_Products",
};

// !!! Helper to get data from localStorage
const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from storage:", error);
    return defaultValue;
  }
};

// !!! Helper to save data to localStorage
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to storage:", error);
  }
};

// !!! Initialize data
const initializeData = () => {
  // !!! Load or set default products
  const products = getFromStorage(STORAGE_KEYS.PRODUCTS, defaultProducts);
  saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  
  // !!! Initialize empty cart and favorites
  const cart = getFromStorage(STORAGE_KEYS.CART, []);
  saveToStorage(STORAGE_KEYS.CART, cart);
  
  const favorites = getFromStorage(STORAGE_KEYS.FAVORITES, []);
  saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
  
  // !!! Make data available globally
  window.Products = products;
  
  // !!! Notify that data is loaded
  window.dispatchEvent(new Event('productsLoaded'));
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('favoritesUpdated'));
};

// !!! Cart management
const addToCart = (product) => {
  const cart = getFromStorage(STORAGE_KEYS.CART, []);
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveToStorage(STORAGE_KEYS.CART, cart);
  window.dispatchEvent(new Event('cartUpdated'));
};

const removeFromCart = (productId) => {
  const cart = getFromStorage(STORAGE_KEYS.CART, []);
  const updatedCart = cart.filter(item => item.id !== productId);
  saveToStorage(STORAGE_KEYS.CART, updatedCart);
  window.dispatchEvent(new Event('cartUpdated'));
};

const updateCartQuantity = (productId, quantity) => {
  const cart = getFromStorage(STORAGE_KEYS.CART, []);
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    saveToStorage(STORAGE_KEYS.CART, cart);
    window.dispatchEvent(new Event('cartUpdated'));
  }
};

// !!! Favorites management
const toggleFavorite = (product) => {
  const favorites = getFromStorage(STORAGE_KEYS.FAVORITES, []);
  const index = favorites.findIndex(item => item.id === product.id);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(product);
  }
  saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
  window.dispatchEvent(new Event('favoritesUpdated'));
};

const isFavorite = (productId) => {
  const favorites = getFromStorage(STORAGE_KEYS.FAVORITES, []);
  return favorites.some(item => item.id === productId);
};

// !!! Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;

// !!! Initialize data when the script loads
initializeData();
