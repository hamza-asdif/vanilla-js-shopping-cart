// DOM Elements
let CartContainer = document.querySelector(".cart");
let favoriteContainer = document.querySelector(".favorites-container");

// Using the getProducts and getSecondProducts functions from script.js
// FavoritesInStorage is still needed locally
let FavoritesInStorage = JSON.parse(localStorage.getItem("Favorites_Products")) || [];

// !!!! functions to DRAW FAVORITES PRODUCT IN WIDGET - HOME PAGE ------------
const DrawFavoritesProduct = function (id) {
  if (
    !window.location.pathname.endsWith("index.html") &&
    !window.location.pathname.endsWith("search.html") &&
    !window.location.pathname.endsWith("/")
  )
    return;

  // Get favoriteWidget from the global scope
  const favoriteWidget = document.querySelector("#favorte-widget");
  if (!favoriteWidget) return;

  // Use getProducts function from script.js
  const product = getProducts().find((item) => item.id == id);
  if (!product) return;

  // First, clear any "no favorites" message
  if (favoriteWidget.querySelector(".favorites-empty")) {
    favoriteWidget.innerHTML = "";
  }

  // Check if product is already in favorites
  if (FavoritesInStorage.some((item) => item.id === id)) return;

  const CurrentProduct = `<div class="favorite-item" id="favorites-product-${product.id}">
        <div class="fav-img-box">
            <img src="${product.Image}" alt="" onclick="driveProducts(${product.id})">
        </div>
        <div class="fav-details">
            <h4 class="fav-title" onclick="driveProducts(${product.id})">${product.name}</h4>
            <div class="fav-price">${product.price} ريال سعودي</div>
        </div>
        <div class="fav-actions">
            <button class="fav-add-to-cart" onclick="addToCartFromFavorites(${product.id})">
                <i class="fas fa-shopping-cart"></i> إضافة للسلة
            </button>
            <button class="favorite-remove" onclick="trashFavorite(${product.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    </div>`;

  favoriteWidget.insertAdjacentHTML("beforeend", CurrentProduct);
  FavoritesProductsToStorage(product);
  updateFavoriteButton(id, true);
};

const updateFavoriteButton = function (id, isFavorite) {
  const favButton = document.querySelector(`#favorite-a${id}`);
  if (!favButton) return;

  if (isFavorite) {
    favButton.style.cursor = "no-drop";
    favButton.innerHTML = `تمت الإضافة للمفضلة <i class="fa-solid fa-heart favorite active-icon" style="color: var(--main-color);"></i>`;
    favButton.onclick = null;
  } else {
    favButton.style.cursor = "pointer";
    favButton.innerHTML = `أضف إلى المفضلة <i class="fa-regular fa-heart favorite"></i>`;
    favButton.onclick = function () {
      favoritesHomePage_Popup(id);
    };
  }
};

// !!!! functions to DRAW FAVORITES PRODUCT IN FAVORITES PAGE ------------
const DrawFavoritesPage = function () {
  if (!window.location.pathname.includes("favorites.html")) return;
  
  console.log("Drawing favorites page");
  console.log("Favorites in storage:", FavoritesInStorage);

  if (!favoriteContainer) {
    console.error("Favorites container not found");
    return;
  }

  if (!FavoritesInStorage.length) {
    favoriteContainer.innerHTML = `
      <div class="empty-favorites">
        <i class="fa-regular fa-heart"></i>
        <h2>لا توجد منتجات في المفضلة</h2>
        <p>قم بإضافة منتجات إلى المفضلة لتظهر هنا</p>
        <a href="index.html" class="back-to-shop">العودة للتسوق</a>
      </div>
    `;
    return;
  }

  const favoritesHTML = FavoritesInStorage.map(
    (product) => `
    <div class="favorite-product" id="favorite-product-${product.id}">
      <div class="favorite-img-box">
        <img src="${product.Image}" alt="${product.name}" onclick="driveProducts(${product.id})">
      </div>
      <div class="favorite-info">
        <h3 class="favorite-title" onclick="driveProducts(${product.id})">${product.name}</h3>
        <span class="favorite-price">${product.price} ريال سعودي</span>
        <div class="favorite-actions">
          <button class="add-to-cart-btn" onclick="addToCartFromFavorites(${product.id})">
            <i class="fas fa-shopping-cart"></i> إضافة للسلة
          </button>
          <button class="remove-favorite-btn" onclick="trashFavorite(${product.id})">
            <i class="fas fa-trash"></i> حذف من المفضلة
          </button>
        </div>
      </div>
    </div>
  `
  ).join("");

  favoriteContainer.innerHTML = favoritesHTML;
};

// !!!! functions to STORE FAVORITES PRODUCT IN LOCAL STORAGE ------------
const FavoritesProductsToStorage = function (product) {
  FavoritesInStorage.push(product);
  localStorage.setItem("Favorites_Products", JSON.stringify(FavoritesInStorage));
  console.log("Product added to favorites:", product);
};

// !!!! functions to REMOVE FAVORITES PRODUCT FROM LOCAL STORAGE ------------
const trashFavorite = function (id) {
  FavoritesInStorage = FavoritesInStorage.filter((item) => item.id !== id);
  localStorage.setItem("Favorites_Products", JSON.stringify(FavoritesInStorage));
  
  // Remove from favorites page if we're on it
  const favoriteProduct = document.querySelector(`#favorite-product-${id}`);
  if (favoriteProduct) {
    favoriteProduct.remove();
    
    // Check if there are no more favorites
    if (FavoritesInStorage.length === 0) {
      DrawFavoritesPage();
    }
  }
  
  // Remove from favorites widget if we're on home page
  const favoritesWidget = document.querySelector(`#favorites-product-${id}`);
  if (favoritesWidget) {
    favoritesWidget.remove();
  }
  
  // Update favorite button state
  updateFavoriteButton(id, false);
  
  console.log("Product removed from favorites:", id);
};

// !!!! functions to ADD PRODUCT TO CART FROM FAVORITES ------------
const addToCartFromFavorites = function (id) {
  const product = FavoritesInStorage.find((item) => item.id === id);
  if (!product) return;
  
  let cartProducts = JSON.parse(localStorage.getItem("Cart_Products")) || [];
  const existingProduct = cartProducts.find((p) => p.id === id);
  
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cartProducts.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
  console.log("Product added to cart from favorites:", product);
  
  // Show notification
  alert("تمت إضافة المنتج إلى سلة التسوق");
};

// Initialize favorites page on load
document.addEventListener("DOMContentLoaded", function() {
  DrawFavoritesPage();
  console.log("Favorites page initialized");
});
