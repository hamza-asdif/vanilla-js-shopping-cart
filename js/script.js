let HomePageDom = document.querySelector(".product-data-section");

// Data access functions
const getProducts = () => {
  const products = JSON.parse(localStorage.getItem("Products"));
  return products || [];
};

const getSecondProducts = () => {
  const products = JSON.parse(localStorage.getItem("Second_Products"));
  return products || [];
};

const getCartProducts = () => {
  const products = JSON.parse(localStorage.getItem("Cart_Products"));
  return products || [];
};

// Add this default second products data
const defaultSecondProducts = [
  {
    id: 1,
    name: "ساعة اليد الفاخرة ONOLA Watch الأكثر مبيعا",
    Image: "images/products/watch.jpeg",
    price: 249,
    quantity: 1,
  },
  {
    id: 2,
    name: "غسالة الأكواب الأتوماتيكية Rinser الأكثر مبيعا",
    Image: "images/products/rinser-cuisine.jpeg",
    price: 179,
    quantity: 1,
  },
  {
    id: 3,
    name: "مجموعة تنظيف الإلكترونيات المتكاملة Cleaner-Set",
    Image: "images/products/cleaner-set.jpeg",
    price: 199,
    quantity: 1,
  },
];

// Initialize second products if they don't exist
const initializeSecondProducts = () => {
  const existingSecondProducts = localStorage.getItem("Second_Products");
  if (!existingSecondProducts) {
    localStorage.setItem(
      "Second_Products",
      JSON.stringify(defaultSecondProducts)
    );
  }
};

// !!!! function to add product to cart
const DontDublicate = function (id) {
  try {
    let cartProducts = getCartProducts();
    const existingProduct = cartProducts.find((p) => p.id === id);
    const product = getProducts().find((p) => p.id === id);

    if (!product) {
      console.error("Product not found:", id);
      return;
    }

    if (!existingProduct) {
      cartProducts.push({ ...product });
      safeLocalStorageSet("Cart_Products", cartProducts);
      renderCartWidget(id);
    } else {
      existingProduct.quantity += 1;
      safeLocalStorageSet("Cart_Products", cartProducts);
      let quantityElement = document.querySelector(`#quantity-${id}`);
      if (quantityElement) {
        quantityElement.innerHTML = existingProduct.quantity;
      }
    }

    updateCartDisplay(cartProducts);
    openSidebar(); // Instead of toggle, explicitly open
  } catch (error) {
    console.error("Error adding product to cart:", error);
    showNotification("حدث خطأ في إضافة المنتج للسلة");
  }
};

// Render cart widget for a specific product
const renderCartWidget = function (id) {
  const product = getProducts().find((p) => p.id === id);
  if (!product || !SidebarUlDiv) return;

  const cartWidget = `
        <div id="sidebar-product-container-${product.id}">
            <li id="product-${product.id}">
                <div class="cart-product-box">
                    <img src="${product.Image}" alt="">
                </div>
                <a href="#">
                    <span class="cart-product-title" onclick="CreateProductPageId(${
                      product.id
                    })">
                        ${product.name}
                    </span>
                </a>
                <div class="cart-product-icons">
                    <button type="button">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button type="button">
                        <i class="fa-regular fa-trash-can" id="trash-product" onclick="TrashFromCart_HomePage(${
                          product.id
                        })"></i>
                    </button>
                </div>
            </li>
            <div class="cart-product-infos" id="product-div-${product.id}">
                <span class="cart-product-infos-title">الكمية</span>
                <span class="cart-product-quantite" id="quantity-${
                  product.id
                }">${product.quantity}</span>
                <span class="cart-product-price">${formatPrice(
                  product.price
                )} ريال سعودي</span>
            </div>
        </div>`;

  // Create a temporary container
  const temp = document.createElement("div");
  temp.innerHTML = cartWidget;
  SidebarUlDiv.appendChild(temp.firstElementChild);
};

// Initialize cart contents
const initializeCartContents = function () {
  if (!SidebarUlDiv) return;

  // Clear existing content
  SidebarUlDiv.innerHTML = "";

  // Get cart products and render each one
  const cartProducts = getCartProducts();
  cartProducts.forEach((product) => renderCartWidget(product.id));

  // Update cart display
  updateCartState(cartProducts);
};

// Update all cart displays
const updateCartDisplay = (cartProducts) => {
  const total = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cartProducts.length;

  // Update header and sidebar displays
  if (sidebarCartSumDom)
    sidebarCartSumDom.innerHTML = `${formatPrice(total)} ريال سعودي`;
  if (HeaderCartSumDom)
    HeaderCartSumDom.innerHTML = `${formatPrice(total)} ريال سعودي`;
  if (HeaderCartCounter) {
    HeaderCartCounter.style.display = itemCount > 0 ? "block" : "none";
    HeaderCartCounter.innerHTML = itemCount;
  }
  if (sidebarCartCounter) sidebarCartCounter.innerHTML = `${itemCount} عناصر`;

  safeLocalStorageSet("TotalPrice", total);
  safeLocalStorageSet("Cart_Counter", itemCount);
};

// Add error boundaries to product drawing
const DrawHomePageProducts = function () {
  const homePageDom = document.querySelector(".product-data-section");
  if (!homePageDom) return;

  try {
    const products = getProducts();
    const favorites =
      JSON.parse(localStorage.getItem("Favorites_Products")) || [];

    if (!products || !products.length) {
      homePageDom.innerHTML =
        '<div class="no-products">جاري تحميل المنتجات...</div>';
      return;
    }

    const productsHTML = products
      .map((product) => {
        if (!product || !product.id) return "";

        const isInFavorites = favorites.some((fav) => fav.id === product.id);
        const favoriteButton = isInFavorites
          ? `<span class="favorite-a" id="favorite-a${product.id}" style="cursor: no-drop;">
              تمت الإضافة للمفضلة
              <i class="fa-solid fa-heart favorite active-icon" style="color: var(--main-color);"></i>
             </span>`
          : `<span class="favorite-a" id="favorite-a${product.id}">
              أضف للمفضلة
              <i class="fa-regular fa-heart favorite"></i>
              <i class="fa-solid fa-heart favorite active-icon" style="display: none;"></i>
             </span>`;

        return `
          <div class="product-container">
            <div class="product-img-box">
              <img src="${product.Image}" alt="${product.name}" loading="lazy" onclick="CreateProductPageId(${product.id})">
            </div>
            <div class="product-infos-box">
              <h2 class="product-title">${product.name}</h2>
              <span class="product-price">${product.price} ريال سعودي</span>
              <button class="product-btn" onclick="DontDublicate(${product.id})">للطلب اضغطي هنا</button>
              ${favoriteButton}
            </div>
          </div>`;
      })
      .join("");

    homePageDom.innerHTML =
      productsHTML || '<div class="no-products">لا توجد منتجات متاحة</div>';
  } catch (error) {
    console.error("Error drawing products:", error);
    homePageDom.innerHTML =
      '<div class="error">حدث خطأ في تحميل المنتجات</div>';
  }
};

// !!!! functions to get product to move into PRODUCTS PAGE
const CreateProductPageId = function (id) {
  const products = getProducts();
  const product = products.find((item) => item.id == id);
  if (product) {
    localStorage.setItem("Product_Id", product.id);
    window.location = "product-page.html";
  }
};

// !!!! functions to get product to move into PRODUCTS PAGE
const CreateSecondProductPageId = function (id) {
  const secondProducts = getSecondProducts();
  const product = secondProducts.find((item) => item.id == id);
  if (product) {
    localStorage.setItem("Second_Product_Id", product.id);
    window.location = "product-page.html";
  }
};

// !!!!!! --------- functions to DRAW THE SECOND PRODUCTS WIDGETS ON HOME PAGE
const drawSecondProduct = function () {
  if (!window.location.pathname.endsWith("index.html")) return;

  const secondProductDom = document.querySelector(".main-second-product");
  if (!secondProductDom) return;

  let secondProducts = getSecondProducts();

  // Use default products if none exist
  if (!secondProducts || !secondProducts.length) {
    secondProducts = defaultSecondProducts;
    localStorage.setItem("Second_Products", JSON.stringify(secondProducts));
  }

  const SecondProductsHtml = secondProducts
    .map(
      (product) => `
        <div class="product-box">
            <a href="#" class="second-product-link">
                <div class="second-product-img-box">
                    <img src="${product.Image}" alt="${product.name}" onclick="CreateSecondProductPageId(${product.id})">
                </div>
                <div class="second-product-product">
                    <h2 class="second-product-product-title">${product.name}</h2>
                    <div class="second-product-prices">
                        <span class="second-product-old-price">249 ريال سعودي</span>
                        <span class="second-product-price">${product.price} ريال سعودي</span>
                    </div>
                </div>
            </a>
        </div>
    `
    )
    .join("");

  secondProductDom.innerHTML =
    SecondProductsHtml ||
    '<div class="no-products">No products available</div>';
};

// Add this function to check favorites state
const updateFavoritesButtonsState = () => {
  const FavoritesInStorage =
    JSON.parse(localStorage.getItem("Favorites_Products")) || [];
  FavoritesInStorage.forEach((product) => {
    const favButton = document.querySelector(`#favorite-a${product.id}`);
    if (favButton) {
      favButton.style.cursor = "no-drop";
      favButton.innerHTML = `تمت الإضافة للمفضلة
        <i class="fa-regular fa-heart favorite" style="display:none"></i>
        <i class="fa-solid fa-heart favorite active-icon"></i>`;
    }
  });
};

// Initialize app state
const initializeApp = () => {
  try {
    // Draw products only if we're on the home page
    if (
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname === "/"
    ) {
      DrawHomePageProducts();
      drawSecondProduct();
    }

    // These should run on all pages
    restoreCartState();
    updateFavoritesButtonsState();

    // Set up storage event listeners for real-time updates
    window.addEventListener("storage", (e) => {
      if (e.key === "Cart_Products") {
        restoreCartState();
      } else if (e.key === "Favorites_Products") {
        updateFavoritesButtonsState();
      }
    });
  } catch (error) {
    console.error("Error initializing app:", error);
  }
};

// Wait for both DOM and products to be ready
let isDomReady = false;
let isDataReady = false;

const tryInitialize = () => {
  if (isDomReady && isDataReady) {
    initializeApp();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  isDomReady = true;
  tryInitialize();
});

window.addEventListener("productsLoaded", () => {
  isDataReady = true;
  tryInitialize();
});

const storedProducts = JSON.parse(localStorage.getItem("Products"));
console.log(storedProducts); // تحقق من وجود المنتجات
