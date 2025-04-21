/**
 * Products, Second Products, Cart, and Favorites Data Management
 * Simplified version without complex caching
 */

// Main products data
const MyProducts = [
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

// Second products data
const MySecondProducts = [
  {
    id: 1,
    name: "ساعة اليد الفاخرة ONOLA Watch الأكثر مبيعا في المملكة - إصدار محدود",
    Image: "images/products/watch.jpeg",
    price: 349,
    quantity: 1,
  },
  {
    id: 2,
    name: "غسالة الأكواب الأتوماتيكية Rinser الأكثر مبيعا في شهر رمضان",
    Image: "images/products/rinser-cuisine.jpeg",
    price: 349,
    quantity: 1,
  },
  {
    id: 3,
    name: "جهاز تبريد مقعد السيارة الذكي Magnetic Fan Car الأكثر مبيعا في العالم",
    Image: "images/new-products/car-product.jpeg",
    price: 349,
    quantity: 1,
  },
];

// Global arrays
let Products = [];
let Second_Products = [];
let Cart_Products = [];
let Favorites_Products = [];

// Simple localStorage helpers
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

const getFromLocalStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Initialize data from localStorage or use defaults
const initializeData = () => {
  console.log("Initializing data in mydata.js");
  
  // Load products from localStorage or use defaults
  Products = getFromLocalStorage("Products", MyProducts);
  Second_Products = getFromLocalStorage("Second_Products", MySecondProducts);
  Cart_Products = getFromLocalStorage("Cart_Products", []);
  Favorites_Products = getFromLocalStorage("Favorites_Products", []);
  
  // Save to localStorage to ensure they exist
  saveToLocalStorage("Products", Products);
  saveToLocalStorage("Second_Products", Second_Products);
  saveToLocalStorage("Cart_Products", Cart_Products);
  saveToLocalStorage("Favorites_Products", Favorites_Products);
  
  // Make products available globally
  window.Products = Products;
  window.Second_Products = Second_Products;
  
  // Dispatch events to notify that data is loaded
  window.dispatchEvent(new Event('productsLoaded'));
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('favoritesUpdated'));
  
  // Try to fetch products from API
  fetchProductsFromAPI();
};

// Fetch products from API
const fetchProductsFromAPI = async () => {
  try {
    const URL = "https://api.jsonbin.io/v3/b/67c54486e41b4d34e49fc194";
    const response = await fetch(URL, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": "$2a$10$JSduiJIAxlAAiB5UQSJ9n.rCUN94IKEeZ8QwNDmKsxfCuURp/m3Xe",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Update products with API data if available
    if (data.record && data.record.Products) {
      Products = data.record.Products;
      saveToLocalStorage("Products", Products);
      window.Products = Products;
    }
    
    if (data.record && data.record.Second_Products) {
      Second_Products = data.record.Second_Products;
      saveToLocalStorage("Second_Products", Second_Products);
      window.Second_Products = Second_Products;
    }
    
    // Notify that products have been updated
    window.dispatchEvent(new Event('productsLoaded'));
  } catch (error) {
    console.error("Error fetching products from API:", error);
    // Continue with local data if API fails
  }
};

// Cart management functions
const addToCart = (product) => {
  // Get the latest cart data from localStorage
  Cart_Products = getFromLocalStorage("Cart_Products", []);
  
  const existingProduct = Cart_Products.find((p) => p.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    Cart_Products.push({ ...product, quantity: 1 });
  }
  
  saveToLocalStorage("Cart_Products", Cart_Products);
  window.dispatchEvent(new Event("cartUpdated"));
};

const removeFromCart = (productId) => {
  // Get the latest cart data from localStorage
  Cart_Products = getFromLocalStorage("Cart_Products", []);
  
  Cart_Products = Cart_Products.filter((p) => p.id !== productId);
  saveToLocalStorage("Cart_Products", Cart_Products);
  window.dispatchEvent(new Event("cartUpdated"));
};

const updateCartQuantity = (productId, quantity) => {
  // Get the latest cart data from localStorage
  Cart_Products = getFromLocalStorage("Cart_Products", []);
  
  const product = Cart_Products.find((p) => p.id === productId);
  if (product) {
    product.quantity = quantity;
    saveToLocalStorage("Cart_Products", Cart_Products);
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

// Favorites management functions
const toggleFavorite = (product) => {
  // Get the latest favorites data from localStorage
  Favorites_Products = getFromLocalStorage("Favorites_Products", []);
  
  const index = Favorites_Products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    Favorites_Products.splice(index, 1);
  } else {
    Favorites_Products.push(product);
  }
  
  saveToLocalStorage("Favorites_Products", Favorites_Products);
  window.dispatchEvent(new Event("favoritesUpdated"));
};

const isFavorite = (productId) => {
  // Get the latest favorites data from localStorage
  Favorites_Products = getFromLocalStorage("Favorites_Products", []);
  return Favorites_Products.some((p) => p.id === productId);
};

// Getter functions for other files to use
window.getProducts = () => getFromLocalStorage("Products", Products);
window.getSecondProducts = () => getFromLocalStorage("Second_Products", Second_Products);
window.getCartProducts = () => getFromLocalStorage("Cart_Products", []);
window.getFavoriteProducts = () => getFromLocalStorage("Favorites_Products", []);

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;

// Log for debugging
console.log("mydata.js loaded");

// Initialize data when the script loads
initializeData();
