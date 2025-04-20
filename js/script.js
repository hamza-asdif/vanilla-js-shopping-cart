let HomePageDom = document.querySelector(".product-data-section");

// Single source of truth for products data
const getProducts = () => JSON.parse(localStorage.getItem("Products")) || [];
const getSecondProducts = () =>
  JSON.parse(localStorage.getItem("Second_Products")) || [];
const getCartProducts = () =>
  JSON.parse(localStorage.getItem("Cart_Products")) || [];

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
  updateCartDisplay(cartProducts);
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

// Draw products into home page with error handling
const DrawHomePageProducts = function () {
  const homePageDom = document.querySelector(".product-data-section");
  if (!homePageDom) return;

  try {
    const products =
      window.Products || JSON.parse(localStorage.getItem("Products")) || [];

    if (!products.length) {
      homePageDom.innerHTML =
        '<div class="no-products">No products available</div>';
      return;
    }

    const productsHTML = products
      .map(
        (product) => `
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
                <span href="#" class="favorite-a" id="favorite-a${product.id}" onclick="favoritesHomePage_Popup(${product.id})">
                    أضف إلى المفضلة
                    <i class="fa-regular fa-heart favorite"></i>
                    <i class="fa-solid fa-heart favorite active-icon" style="display: none;"></i>
                </span>
            </div>
        </div>
    `
      )
      .join("");

    homePageDom.innerHTML = productsHTML;
  } catch (error) {
    console.error("Error drawing products:", error);
    homePageDom.innerHTML = '<div class="error">Error loading products</div>';
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

  const secondProducts = getSecondProducts();
  const SecondProductsHtml = secondProducts
    .map(
      (product) => `
        <div class="product-box">
            <a href="#" class="second-product-link">
                <div class="second-product-img-box">
                    <img src=${product.Image} alt="" onclick="CreateSecondProductPageId(${product.id})">
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

  secondProductDom.innerHTML = SecondProductsHtml;
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

// Initialize products
window.addEventListener("productsLoaded", DrawHomePageProducts);

// Also try to draw products on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  if (window.Products) {
    DrawHomePageProducts();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const products = getProducts();
  const secondProducts = getSecondProducts();
  if (products.length > 0 || secondProducts.length > 0) {
    DrawHomePageProducts();
    drawSecondProduct();
    initializeCartContents();
    updateFavoritesButtonsState(); // Add this line
  }
});

const storedProducts = JSON.parse(localStorage.getItem("Products"));
console.log(storedProducts); // تحقق من وجود المنتجات
