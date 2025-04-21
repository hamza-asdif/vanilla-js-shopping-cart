// !!! Get main product section DOM
let HomePageDom = document.querySelector(".product-data-section");

// !!! Provide global product/cart/favorite getters if not already defined
if (typeof getProducts !== 'function') {
  window.getProducts = () => JSON.parse(localStorage.getItem("Products")) || [];
}
if (typeof getSecondProducts !== 'function') {
  window.getSecondProducts = () => JSON.parse(localStorage.getItem("Second_Products")) || [];
}
if (typeof getCartProducts !== 'function') {
  window.getCartProducts = () => JSON.parse(localStorage.getItem("Cart_Products")) || [];
}
if (typeof getFavoriteProducts !== 'function') {
  window.getFavoriteProducts = () => JSON.parse(localStorage.getItem("Favorites_Products")) || [];
}

// !!! Default data for second products
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

// !!! Initialize second products if not present
const initializeSecondProducts = () => {
  const existingSecondProducts = localStorage.getItem("Second_Products");
  if (!existingSecondProducts) {
    localStorage.setItem(
      "Second_Products",
      JSON.stringify(defaultSecondProducts)
    );
  }
};

// !!! Add product to cart, prevent duplicates
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
    openSidebar(); 
  } catch (error) {
    console.error("Error adding product to cart:", error);
    showNotification("حدث خطأ في إضافة المنتج للسلة");
  }
};

// !!! Render cart widget for a product
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

// !!! Initialize cart contents in sidebar
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

// !!! Update all cart displays (header, sidebar, etc)
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

// !!! Draw all products on home page
const DrawHomePageProducts = function () {
  const homePageDom = document.querySelector(".product-data-section");
  if (!homePageDom) return;

  try {
    const products =
      window.Products || JSON.parse(localStorage.getItem("Products")) || [];
    const favorites =
      JSON.parse(localStorage.getItem("Favorites_Products")) || [];

    if (!products.length) {
      homePageDom.innerHTML =
        '<div class="no-products">No products available</div>';
      return;
    }

    const productsHTML = products
      .map((product) => {
        const isInFavorites = favorites.some((fav) => fav.id === product.id);
        const favoriteButton = isInFavorites
          ? `
        <span class="favorite-a" id="favorite-a${product.id}" style="cursor: no-drop;">
          تمت الإضافة للمفضلة
          <i class="fa-solid fa-heart favorite active-icon" style="color: var(--main-color);"></i>
        </span>
      `
          : `
        <span class="favorite-a" id="favorite-a${product.id}" onclick="favoritesHomePage_Popup(${product.id})">
          أضف إلى المفضلة
          <i class="fa-regular fa-heart favorite"></i>
          <i class="fa-solid fa-heart favorite active-icon" style="display: none;"></i>
        </span>
      `;

        return `
        <div class="product-container">
            <a href="#" class="product-a">
                <div class="product-img-box">
                    <img src="${product.Image}" alt="" class="product-img" onclick="CreateProductPageId(${product.id})">
                </div>
            </a>
            <div class="product-infos-box">
                <a href="#" class="product-title-link">
                    <h3 class="product-title">${product.name}</h3>
                </a>
                <span class="product-price">${product.price} ريال سعودي</span>
                <button class="product-btn" onclick="DontDublicate(${product.id})">للطلب اضغطي هنا</button>
                ${favoriteButton}
            </div>
        </div>
    `;
      })
      .join("");

    homePageDom.innerHTML = productsHTML;
  } catch (error) {
    console.error("Error drawing products:", error);
    homePageDom.innerHTML = '<div class="error">Error loading products</div>';
  }
};

// !!! Draw second products widget on home page
const drawSecondProduct = function () {
  if (!window.location.pathname.includes("index.html") && 
      !window.location.pathname.endsWith('/')) return;

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
                        <span class="second-product-old-price">${Math.round(product.price * 1.2)} ريال سعودي</span>
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
    '<div class="no-products">لا توجد منتجات متاحة</div>';
};

// !!! Move product to product page by id
const CreateProductPageId = function (id) {
  const products = getProducts();
  const product = products.find((item) => item.id == id);
  if (product) {
    localStorage.setItem("Product_Id", product.id);
    window.location = "product-page.html";
  }
};

// !!! Move second product to product page by id
const CreateSecondProductPageId = function (id) {
  const secondProducts = getSecondProducts();
  const product = secondProducts.find((item) => item.id == id);
  if (product) {
    // Set Second_Product_Id and clear Product_Id to avoid conflict
    localStorage.setItem("Second_Product_Id", product.id);
    localStorage.removeItem("Product_Id");
    window.location = "product-page.html";
  }
};

// !!! Update favorite buttons state on home page
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

// !!! Listen for cart storage changes and restore cart state
window.addEventListener("storage", function (e) {
  if (e.key === "Cart_Products") {
    restoreCartState();
  }
});

// !!! Maintain cart state on page refresh
window.addEventListener("beforeunload", function () {
  const cartProducts = JSON.parse(localStorage.getItem("Cart_Products")) || [];
  localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
});

// !!! Draw products after loading event
window.addEventListener("productsLoaded", function() {
  DrawHomePageProducts();
  drawSecondProduct();
});

// !!! Draw products on DOMContentLoaded

document.addEventListener("DOMContentLoaded", function () {

  initializeSecondProducts();
  
  
  DrawHomePageProducts();
  drawSecondProduct();
  
  
  if (typeof restoreCartState === 'function') {
    restoreCartState();
  } else {
    // update cart info
    const cartProducts = JSON.parse(localStorage.getItem("Cart_Products")) || [];
    const itemCount = cartProducts.length;
    const HeaderCartCounter = document.querySelector(".cart-counter");
    if (HeaderCartCounter) {
      HeaderCartCounter.style.display = itemCount > 0 ? "block" : "none";
      HeaderCartCounter.innerHTML = itemCount;
    }
  }
  
  updateFavoritesButtonsState();
  
  
  if (window.Products) {
    DrawHomePageProducts();
  }
  
  // التأكد من وجود المنتجات في localStorage
  const storedProducts = JSON.parse(localStorage.getItem("Products"));
  const storedSecondProducts = JSON.parse(localStorage.getItem("Second_Products"));
  
  
});

// !!! Listen for second products loaded event
window.addEventListener("secondProductsLoaded", function() {
  drawSecondProduct();
});

// !!! Listen for favorites update event
window.addEventListener("favoritesUpdated", function() {
  updateFavoritesButtonsState();
});

const storedProducts = JSON.parse(localStorage.getItem("Products"));
