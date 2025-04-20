// DOM Elements
let CartContainer = document.querySelector(".cart");
let favoriteContainer = document.querySelector(".favorites-container");

// Safe localStorage operations
const safeGetFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem("Favorites_Products")) || [];
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
};

const safeSaveFavorites = (favorites) => {
  try {
    localStorage.setItem("Favorites_Products", JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error("Error saving favorites:", error);
    return false;
  }
};

// Favorites state management
let FavoritesInStorage = safeGetFavorites();

const updateFavoriteButton = (id, isFavorite) => {
  const button = document.querySelector(`#favorite-a${id}`);
  if (!button) return;

  if (isFavorite) {
    button.style.cursor = "no-drop";
    button.innerHTML = `
      تمت الإضافة للمفضلة
      <i class="fa-solid fa-heart favorite active-icon" style="color: var(--main-color);"></i>
    `;
  } else {
    button.style.cursor = "pointer";
    button.innerHTML = `
      أضف للمفضلة
      <i class="fa-regular fa-heart favorite"></i>
      <i class="fa-solid fa-heart favorite active-icon" style="display: none;"></i>
    `;
  }
};

// Draw favorites in widget
const DrawFavroites_FromStorage = function () {
  if (!favoriteWidget) return;

  try {
    favoriteWidget.innerHTML = "";
    const favorites = safeGetFavorites();

    if (favorites.length === 0) {
      favoriteWidget.innerHTML = `
        <div class="favorites-empty">
          <i class="fas fa-heart-broken"></i>
          <h3>لا توجد منتجات في المفضلة</h3>
          <p>يمكنك إضافة المنتجات التي تعجبك إلى المفضلة</p>
        </div>`;
      return;
    }

    favorites.forEach(function (item) {
      const favHtml = `
        <div class="favorite-item" id="favorites-product-${item.id}">
          <div class="fav-img-box">
            <img src="${item.Image}" alt="${item.name}" onclick="driveProducts(${item.id})">
          </div>
          <div class="fav-product-info">
            <h3 class="fav-product-title">${item.name}</h3>
            <span class="fav-product-price">${item.price} ريال سعودي</span>
            <div class="fav-actions">
              <button onclick="addToCartFromFavorites(${item.id})" class="add-to-cart-btn">
                <i class="fas fa-cart-plus"></i>
                أضف إلى السلة
              </button>
              <button onclick="removeFavorite(${item.id})" class="remove-favorite-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>`;
      favoriteWidget.insertAdjacentHTML("beforeend", favHtml);
    });
  } catch (error) {
    console.error("Error drawing favorites:", error);
    favoriteWidget.innerHTML =
      '<div class="error">حدث خطأ في تحميل المفضلة</div>';
  }
};

// Add to favorites
const AddToFavorites = function (id) {
  try {
    const product = Products.find((item) => item.id === id);
    if (!product) return;

    if (FavoritesInStorage.some((item) => item.id === id)) {
      showNotification("هذا المنتج موجود بالفعل في المفضلة");
      return;
    }

    FavoritesInStorage.push(product);
    safeSaveFavorites(FavoritesInStorage);
    DrawFavroites_FromStorage();
    updateFavoriteButton(id, true);
    showNotification("تمت إضافة المنتج إلى المفضلة بنجاح", "success");
  } catch (error) {
    console.error("Error adding to favorites:", error);
    showNotification("حدث خطأ في إضافة المنتج إلى المفضلة");
  }
};

// Remove from favorites
const removeFavorite = function (id) {
  try {
    const favElement = document.querySelector(`#favorites-product-${id}`);
    if (favElement) {
      favElement.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => {
        FavoritesInStorage = FavoritesInStorage.filter(
          (item) => item.id !== id
        );
        safeSaveFavorites(FavoritesInStorage);
        DrawFavroites_FromStorage();
        updateFavoriteButton(id, false);
        showNotification("تم إزالة المنتج من المفضلة", "success");
      }, 300);
    }
  } catch (error) {
    console.error("Error removing from favorites:", error);
    showNotification("حدث خطأ في إزالة المنتج من المفضلة");
  }
};

// Add to cart from favorites
const addToCartFromFavorites = function (id) {
  closeFavoritesWidget();
  setTimeout(() => {
    DontDublicate(id);
  }, 300);
};

// Initialize favorites on page load
const initializeFavoritesState = function () {
  const favorites = safeGetFavorites();
  favorites.forEach((item) => {
    updateFavoriteButton(item.id, true);
  });
  DrawFavroites_FromStorage();
};

// Add new helper function to show notifications
const showNotification = (message, type = "error") => {
  const notification = document.createElement("div");
  notification.className = `favorites-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
};

// Close favorites widget
const closeFavoritesWidget = () => {
  if (favoriteContainer && Overlay) {
    favoriteContainer.style.display = "none";
    Overlay.style.display = "none";
  }
};

// Event Listeners
document.addEventListener("DOMContentLoaded", initializeFavoritesState);

window.addEventListener("storage", (e) => {
  if (e.key === "Favorites_Products") {
    FavoritesInStorage = safeGetFavorites();
    initializeFavoritesState();
  }
});

// Exports
window.AddToFavorites = AddToFavorites;
window.removeFavorite = removeFavorite;
window.addToCartFromFavorites = addToCartFromFavorites;
