// ** products variables & functions here **
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

// Cache management
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const CACHE_KEYS = {
  PRODUCTS: "Products",
  SECOND_PRODUCTS: "Second_Products",
  CACHE_TIMESTAMP: "products_cache_timestamp",
};

// Initialize Products array in global scope
let Products = [];
let My_Second_Products = [];

const isCacheValid = () => {
  const timestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
  if (!timestamp) return false;
  return Date.now() - parseInt(timestamp) < CACHE_DURATION;
};

const setCache = (data, key) => {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
};

const handleFetchError = (error, fallbackData, key) => {
  console.error(`Error fetching ${key}:`, error);
  if (isCacheValid()) {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }
  return fallbackData;
};

// Initialize products immediately with fallback data
Products = JSON.parse(localStorage.getItem(CACHE_KEYS.PRODUCTS)) || MyProducts;
localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(Products));

// Then try to fetch updated data
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
    Products = data.record.Products;
    setCache(Products, CACHE_KEYS.PRODUCTS);
    return Products;
  } catch (err) {
    Products = handleFetchError(err, MyProducts, CACHE_KEYS.PRODUCTS);
    return Products;
  }
};

// Initialize data and dispatch event when ready
const initializeData = async (retryCount = 3) => {
  try {
    const products = await FetchProducts();
    window.dispatchEvent(new Event("productsLoaded"));
  } catch (error) {
    console.error("Error initializing data:", error);
    if (retryCount > 0) {
      setTimeout(() => initializeData(retryCount - 1), 2000);
    }
  }
};

// Run initialization
initializeData();
