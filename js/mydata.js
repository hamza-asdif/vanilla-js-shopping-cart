/**
 * Products, Second Products, Cart, and Favorites Data Management
 */

// Main products fallback
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

// Second products fallback
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

// Cache keys and duration
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const CACHE_KEYS = {
  PRODUCTS: "Products",
  SECOND_PRODUCTS: "Second_Products",
  CART: "Cart_Products",
  FAVORITES: "Favorite_Products",
  CACHE_TIMESTAMP: "products_cache_timestamp",
};

// Global arrays
let Products = [];
let My_Second_Products = [];
let Cart_Products = [];
let Favorite_Products = [];

// Cache helpers
const isCacheValid = () => {
  const timestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
  if (!timestamp) return false;
  return Date.now() - parseInt(timestamp) < CACHE_DURATION;
};

const setCache = (data, key) => {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
};

const getCache = (key, fallbackData) => {
  try {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error(`Error parsing cached ${key}:`, error);
  }
  return fallbackData;
};

const handleFetchError = (error, fallbackData, key) => {
  console.error(`Error fetching ${key}:`, error);
  if (isCacheValid()) {
    return getCache(key, fallbackData);
  }
  return fallbackData;
};

// Initialize all data from localStorage or fallback
const initializeLocalData = () => {
  Products = getCache(CACHE_KEYS.PRODUCTS, MyProducts);
  My_Second_Products = getCache(CACHE_KEYS.SECOND_PRODUCTS, MySecondProducts);
  Cart_Products = getCache(CACHE_KEYS.CART, []);
  Favorite_Products = getCache(CACHE_KEYS.FAVORITES, []);

  // Save to localStorage if not present
  setCache(Products, CACHE_KEYS.PRODUCTS);
  setCache(My_Second_Products, CACHE_KEYS.SECOND_PRODUCTS);
  setCache(Cart_Products, CACHE_KEYS.CART);
  setCache(Favorite_Products, CACHE_KEYS.FAVORITES);

  // Dispatch events after initialization
  window.dispatchEvent(new Event("productsLoaded"));
  window.dispatchEvent(new Event("secondProductsLoaded"));
};

// Fetch products from API
const FetchProducts = async () => {
  try {
    const URL = "https://api.jsonbin.io/v3/b/67c54486e41b4d34e49fc194";
    const response = await fetch(URL, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key":
          "$2a$10$JSduiJIAxlAAiB5UQSJ9n.rCUN94IKEeZ8QwNDmKsxfCuURp/m3Xe",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    Products = data.record.Products || MyProducts;
    My_Second_Products = data.record.Second_Products || MySecondProducts;
    setCache(Products, CACHE_KEYS.PRODUCTS);
    setCache(My_Second_Products, CACHE_KEYS.SECOND_PRODUCTS);
    return { Products, My_Second_Products };
  } catch (err) {
    Products = handleFetchError(err, MyProducts, CACHE_KEYS.PRODUCTS);
    My_Second_Products = handleFetchError(
      err,
      MySecondProducts,
      CACHE_KEYS.SECOND_PRODUCTS
    );
    return { Products, My_Second_Products };
  }
};

// Cart management
const addToCart = (product) => {
  const existingProduct = Cart_Products.find((p) => p.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    Cart_Products.push({ ...product, quantity: 1 });
  }
  setCache(Cart_Products, CACHE_KEYS.CART);
  window.dispatchEvent(new Event("cartUpdated"));
};

const removeFromCart = (productId) => {
  Cart_Products = Cart_Products.filter((p) => p.id !== productId);
  setCache(Cart_Products, CACHE_KEYS.CART);
  window.dispatchEvent(new Event("cartUpdated"));
};

const updateCartQuantity = (productId, quantity) => {
  const product = Cart_Products.find((p) => p.id === productId);
  if (product) {
    product.quantity = quantity;
    setCache(Cart_Products, CACHE_KEYS.CART);
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

// Favorites management
const toggleFavorite = (product) => {
  const index = Favorite_Products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    Favorite_Products.splice(index, 1);
  } else {
    Favorite_Products.push(product);
  }
  setCache(Favorite_Products, CACHE_KEYS.FAVORITES);
  window.dispatchEvent(new Event("favoritesUpdated"));
};

const isFavorite = (productId) => {
  return Favorite_Products.some((p) => p.id === productId);
};

// Initialize data and dispatch events
const initializeData = async (retryCount = 3) => {
  try {
    initializeLocalData();
    const {
      Products: fetchedProducts,
      My_Second_Products: fetchedSecondProducts,
    } = await FetchProducts();
    Products = fetchedProducts;
    My_Second_Products = fetchedSecondProducts;
    window.dispatchEvent(new Event("productsLoaded"));
    window.dispatchEvent(new Event("secondProductsLoaded"));
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("favoritesUpdated"));
  } catch (error) {
    console.error("Error initializing data:", error);
    if (retryCount > 0) {
      setTimeout(() => initializeData(retryCount - 1), 2000);
    } else {
      window.dispatchEvent(new Event("productsLoaded"));
      window.dispatchEvent(new Event("secondProductsLoaded"));
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("favoritesUpdated"));
    }
  }
};

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;
window.getCartProducts = () => Cart_Products;
window.getFavoriteProducts = () => Favorite_Products;

// Run initialization
initializeData();
