// DOM Elements
let CartContainer = document.querySelector(".cart");
let favoriteContainer = document.querySelector(".favorites-container");
let FavoritesInStorage =
  JSON.parse(localStorage.getItem("Favorites_Products")) || [];

// !!!! functions to DRAW FAVORITES PRODUCT IN WIDGET - HOME PAGE ------------
const DrawFavoritesProduct = function (id) {
  if (
    !window.location.pathname.endsWith("index.html") &&
    !window.location.pathname.endsWith("search.html")
  )
    return;

  const product = Products.find((item) => item.id == id);
  if (!product || !favoriteWidget) return;

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

  favButton.style.cursor = isFavorite ? "no-drop" : "pointer";
  favButton.innerHTML = isFavorite
    ? `تمت اضافته الى السلة
        <i class="fa-regular fa-heart favorite" style="display:none"></i>
        <i class="fa-solid fa-heart favorite active-icon"></i>`
    : `أضف إلى المفضلة
        <i class="fa-regular fa-heart favorite"></i>
        <i class="fa-solid fa-heart favorite active-icon" style="display: none;"></i>`;
};

const FavoritesProductsToStorage = function (product) {
  if (!product || FavoritesInStorage.some((item) => item.id === product.id))
    return;

  FavoritesInStorage.push(product);
  localStorage.setItem(
    "Favorites_Products",
    JSON.stringify(FavoritesInStorage)
  );
};

const DrawFavroites_FromStorage = function () {
  if (!favoriteWidget) return;
  favoriteWidget.innerHTML = "";

  const favorites =
    JSON.parse(localStorage.getItem("Favorites_Products")) || [];

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
    const Fav_Storage = `
      <div class="favorite-item" id="favorites-product-${item.id}">
        <div class="fav-img-box">
          <img src="${item.Image}" alt="${item.name}" onclick="driveProducts(${item.id})">
        </div>
        <div class="fav-details">
          <h4 class="fav-title">${item.name}</h4>
          <div class="fav-price">${item.price} ريال سعودي</div>
        </div>
        <div class="fav-actions">
          <button class="fav-add-to-cart" onclick="addToCartFromFavorites(${item.id})">
            <i class="fas fa-shopping-cart"></i>
            إضافة للسلة
          </button>
          <button class="favorite-remove" onclick="trashFavorite(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    favoriteWidget.insertAdjacentHTML("beforeend", Fav_Storage);
  });
};

const closeFavoritesWidget = () => {
  if (favoriteContainer && Overlay) {
    favoriteContainer.style.display = "none";
    Overlay.style.display = "none";
  }
};

// Make favoritesHomePage_Popup available globally
window.favoritesHomePage_Popup = function (id) {
  const isAlreadyInFavorites = FavoritesInStorage.some(
    (item) => item.id === id
  );

  if (isAlreadyInFavorites) {
    showNotification("هذا المنتج موجود بالفعل في المفضلة", "info");
    return;
  }

  const product = Products.find((item) => item.id === id);
  if (!product) return;

  const popup = document.createElement("div");
  popup.className = "favorite-popup";
  popup.innerHTML = `
    <div class="favorite-popup-content">
      <button class="close-popup-btn">&times;</button>
      <div class="popup-icon">
        <i class="fa-solid fa-heart" style="font-size: 3rem; color: var(--main-color);"></i>
      </div>
      <h3>إضافة للمفضلة</h3>
      <p>هل تريد إضافة "${product.name}" إلى قائمة المفضلة الخاصة بك؟</p>
      <div class="popup-buttons">
        <button class="confirm-favorite">
          <i class="fa-solid fa-heart"></i>
          إضافة للمفضلة
        </button>
        <button class="cancel-favorite">
          <i class="fa-solid fa-times"></i>
          إلغاء
        </button>
      </div>
    </div>
  `;

  const overlay = document.createElement("div");
  overlay.className = "overlay favorite-overlay";

  // Remove any existing popups
  document
    .querySelectorAll(".favorite-popup, .favorite-overlay")
    .forEach((el) => el.remove());

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  const closePopup = () => {
    popup.classList.add("fade-out");
    overlay.classList.add("fade-out");
    setTimeout(() => {
      popup.remove();
      overlay.remove();
    }, 300);
  };

  popup.querySelector(".close-popup-btn").addEventListener("click", closePopup);
  popup.querySelector(".cancel-favorite").addEventListener("click", closePopup);
  overlay.addEventListener("click", closePopup);

  popup.querySelector(".confirm-favorite").addEventListener("click", () => {
    const Added_to_Favorites = document.querySelector(
      `#favorites-product-${id}`
    );
    if (!Added_to_Favorites) {
      DrawFavoritesProduct(id);
    }

    if (CartContainer && Overlay && favoriteContainer) {
      CartContainer.style.scale = "1";
      Overlay.style.display = "block";
      favoriteContainer.style.display = "block";
    }
    closePopup();
  });
};

const trashFavorite = function () {
  FavoritesInStorage.forEach(function (element) {
    const button = document.querySelector(`#trash-${element.id}`);
    const FavoriteDomChild = document.querySelector(
      `#favorites-product-${element.id}`
    );
    if (!button || !FavoriteDomChild) return;

    button.addEventListener("click", function () {
      FavoritesInStorage = FavoritesInStorage.filter(
        (item) => item.id != element.id
      );
      localStorage.setItem(
        "Favorites_Products",
        JSON.stringify(FavoritesInStorage)
      );
      FavoriteDomChild.remove();
      updateFavoriteButton(element.id, false);
    });
  });
};

function ForFavotitePage() {
  if (window.location.pathname.endsWith("favorites.html")) {
    if (CartContainer) CartContainer.style.scale = "1";
    if (favoriteContainer) {
      favoriteContainer.removeAttribute("class");
      favoriteContainer.setAttribute("class", "new-favorite-page");
    }
    // Initialize favorites content
    DrawFavroites_FromStorage();
  }
}

// New function to handle adding to cart from favorites
const addToCartFromFavorites = function (id) {
  closeFavoritesWidget();
  setTimeout(() => {
    DontDublicate(id);
  }, 300); // Wait for favorites widget to close
};

// Add this new function to check favorites on page load
const initializeFavoritesState = function () {
  const favorites =
    JSON.parse(localStorage.getItem("Favorites_Products")) || [];
  favorites.forEach((item) => {
    const favButton = document.querySelector(`#favorite-a${item.id}`);
    if (favButton) {
      favButton.style.cursor = "no-drop";
      favButton.innerHTML = `تمت الإضافة للمفضلة
        <i class="fa-regular fa-heart favorite" style="display:none"></i>
        <i class="fa-solid fa-heart favorite active-icon" style="color: #ff6b6b;"></i>`;
    }
  });
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

// Initialize favorites
document.addEventListener("DOMContentLoaded", function () {
  const stillOnPageBtn = document.querySelector(".still-on-page");
  if (stillOnPageBtn) {
    stillOnPageBtn.addEventListener("click", closeFavoritesWidget);
  }

  // Close favorites widget when clicking overlay
  if (Overlay) {
    Overlay.addEventListener("click", closeFavoritesWidget);
  }

  // Close on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeFavoritesWidget();
    }
  });

  // Rest of your existing DOMContentLoaded code
  DrawFavroites_FromStorage();
  if (window.location.pathname.endsWith("favorites.html")) {
    ForFavotitePage();
  }
  trashFavorite();
  initializeFavoritesState();
});
