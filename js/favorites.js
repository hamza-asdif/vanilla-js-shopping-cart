// DOM Elements
let CartContainer = document.querySelector(".cart");
let favoriteContainer = document.querySelector(".favorites-content");

// Using the getProducts and getSecondProducts functions from script.js
// FavoritesInStorage is still needed locally
let FavoritesInStorage =
  JSON.parse(localStorage.getItem("Favorites_Products")) || [];

// Debug log to check what's in favorites storage
console.log("Initial Favorites in storage:", FavoritesInStorage);

// Function to handle adding products to favorites from home page
const favoritesHomePage_Popup = function (id) {
  try {
    // Get product data
    const product = getProducts().find((item) => item.id == id);
    if (!product) {
      console.error("Product not found:", id);
      return;
    }

    // Check if product is already in favorites
    const isAlreadyInFavorites = FavoritesInStorage.some(
      (item) => item.id === id
    );

    if (isAlreadyInFavorites) {
      // If already in favorites, show notification
      if (window.showNotification) {
        window.showNotification("هذا المنتج موجود بالفعل في المفضلة", "error");
      }
      return;
    }

    // Use the global toggleFavorite function from mydata.js
    if (window.toggleFavorite) {
      window.toggleFavorite(product);

      // Refresh the local favorites array
      FavoritesInStorage =
        JSON.parse(localStorage.getItem("Favorites_Products")) || [];

      // Update UI in home page
      updateFavoriteButton(id, true);

      // Update favorites widget if on home page
      if (
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname.endsWith("/")
      ) {
        updateFavoritesWidget();
      }

      // Show success notification
      if (window.showNotification) {
        window.showNotification("تمت إضافة المنتج إلى المفضلة", "success");
      }
    } else {
      console.error("toggleFavorite function not found");
    }
  } catch (error) {
    console.error("Error adding product to favorites:", error);
    if (window.showNotification) {
      window.showNotification(
        "حدث خطأ أثناء إضافة المنتج إلى المفضلة",
        "error"
      );
    }
  }
};

// New function to update the favorites widget
const updateFavoritesWidget = function () {
  const favoriteWidget = document.querySelector("#favorte-widget");
  if (!favoriteWidget) return;

  // Get the latest favorites
  FavoritesInStorage =
    JSON.parse(localStorage.getItem("Favorites_Products")) || [];

  if (FavoritesInStorage.length === 0) {
    favoriteWidget.innerHTML = `
      <div class="favorites-empty">
        <i class="fa-regular fa-heart"></i>
        <p>لا توجد منتجات في المفضلة</p>
      </div>
    `;
    return;
  }

  // Clear the widget
  favoriteWidget.innerHTML = "";

  // Add all favorites to the widget
  FavoritesInStorage.forEach((product) => {
    const favoriteItem = `<div class="favorite-item" id="favorites-product-${product.id}">
        <div class="fav-img-box">
            <img src="${product.Image}" alt="" onclick="CreateProductPageId(${product.id})">
        </div>
        <div class="fav-details">
            <h4 class="fav-title" onclick="CreateProductPageId(${product.id})">${product.name}</h4>
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

    favoriteWidget.insertAdjacentHTML("beforeend", favoriteItem);
  });
};

// Function to remove a product from favorites
const trashFavorite = function (id) {
  try {
    // Remove product from FavoritesInStorage
    FavoritesInStorage = FavoritesInStorage.filter((item) => item.id !== id);
    // Update localStorage
    localStorage.setItem(
      "Favorites_Products",
      JSON.stringify(FavoritesInStorage)
    );

    // Update UI: redraw favorites page and widget if present
    if (typeof DrawFavoritesPage === "function") {
      DrawFavoritesPage();
    } else if (window.DrawFavoritesPage) {
      window.DrawFavoritesPage();
    }
    if (typeof updateFavoritesWidget === "function") {
      updateFavoritesWidget();
    } else if (window.updateFavoritesWidget) {
      window.updateFavoritesWidget();
    }

    // Show notification
    if (window.showNotification) {
      window.showNotification("تمت إزالة المنتج من المفضلة", "success");
    }
  } catch (error) {
    console.error("Error removing product from favorites:", error);
    if (window.showNotification) {
      window.showNotification("حدث خطأ أثناء إزالة المنتج من المفضلة", "error");
    }
  }
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
  // Check if we're on the favorites page
  const currentPage = window.location.pathname;
  const isFavoritesPage =
    currentPage === "/" ||
    currentPage === "/favorites" ||
    currentPage.includes("/favorites.html");

  if (!isFavoritesPage) {
    console.log("Not on favorites page, path:", currentPage);
    return;
  }

  console.log("Drawing favorites page");
  console.log("Favorites in storage:", FavoritesInStorage);

  // Re-fetch the container in case it wasn't available when the script loaded
  favoriteContainer = document.querySelector(".favorites-content");

  if (!favoriteContainer) {
    console.error("Favorites container not found");
    return;
  }

  // Re-fetch favorites from localStorage to ensure we have the latest data
  FavoritesInStorage =
    JSON.parse(localStorage.getItem("Favorites_Products")) || [];
  console.log("Updated favorites from localStorage:", FavoritesInStorage);

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
        <img src="${product.Image}" alt="${product.name}" onclick="CreateProductPageId(${product.id})">
      </div>
      <div class="favorite-info">
        <h3 class="favorite-title" onclick="CreateProductPageId(${product.id})">${product.name}</h3>
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
  console.log("Favorites HTML generated and inserted into container");
};

// !!!! functions to STORE FAVORITES PRODUCT IN LOCAL STORAGE ------------
const FavoritesProductsToStorage = function (product) {
  // Check if product already exists in favorites
  const exists = FavoritesInStorage.some((item) => item.id === product.id);
  if (exists) {
    console.log("Product already in favorites:", product.id);
    return;
  }

  // Make sure we're storing a complete product object with all required properties
  const completeProduct = {
    id: product.id,
    name: product.name,
    Image: product.Image,
    price: product.price,
    quantity: product.quantity || 1,
  };

  FavoritesInStorage.push(completeProduct);
  localStorage.setItem(
    "Favorites_Products",
    JSON.stringify(FavoritesInStorage)
  );
  console.log("Product added to favorites:", completeProduct);
};

// !!!! functions to REMOVE FAVORITES PRODUCT FROM LOCAL STORAGE ------------
// Removed this function as it's replaced by the new trashFavorite function

// !!!! functions to ADD PRODUCT TO CART FROM FAVORITES ------------
const addToCartFromFavorites = function (id) {
  try {
    // Get product data
    const product = FavoritesInStorage.find((item) => item.id === id);
    if (!product) {
      console.error("Product not found in favorites:", id);
      return;
    }

    // Get cart products
    let cartProducts = getCartProducts();
    const existingProduct = cartProducts.find((p) => p.id === id);

    if (existingProduct) {
      // If product already exists in cart, increase quantity
      existingProduct.quantity += 1;
      localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));

      // Update quantity display if on cart page
      let quantityElement = document.querySelector(`#quantity-${id}`);
      if (quantityElement) {
        quantityElement.innerHTML = existingProduct.quantity;
      }
    } else {
      // Add new product to cart
      cartProducts.push({ ...product, quantity: 1 });
      localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));

      // Render the cart widget for this product
      if (typeof renderCartWidget === "function") {
        renderCartWidget(id);
      } else if (window.renderCartWidget) {
        window.renderCartWidget(id);
      }
    }

    // Update cart display
    if (typeof updateCartDisplay === "function") {
      updateCartDisplay(cartProducts);
    } else if (window.updateCartDisplay) {
      window.updateCartDisplay(cartProducts);
    }

    // Open the sidebar
    if (typeof openSidebar === "function") {
      openSidebar();
    } else if (window.openSidebar) {
      window.openSidebar();
    }

    console.log("Product added to cart from favorites:", product);
  } catch (error) {
    console.error("Error adding product to cart from favorites:", error);
    if (window.showNotification) {
      window.showNotification("حدث خطأ في إضافة المنتج للسلة", "error");
    }
  }
};

// Initialize favorites page on load
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  console.log("Current path:", window.location.pathname);
  console.log(
    "Favorites container exists:",
    !!document.querySelector(".favorites-content")
  );

  // Initialize favorites
  DrawFavoritesPage();
  console.log("Favorites page initialization complete");
});

// Also check when window loads (in case DOMContentLoaded was missed)
window.addEventListener("load", function () {
  console.log("Window loaded");
  DrawFavoritesPage();
});
