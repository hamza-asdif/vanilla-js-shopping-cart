// !!! DOM element references for favorites and cart
let CartContainer = document.querySelector(".cart");
let favoriteContainer = document.querySelector(".favorites-content");

// !!! Local favorites data from storage
let FavoritesInStorage =
  JSON.parse(localStorage.getItem("Favorites_Products")) || [];

console.log("Initial Favorites in storage:", FavoritesInStorage);

// !!! Add product to favorites from home page
const favoritesHomePage_Popup = function (id) {
  try {
    const product = getProducts().find((item) => item.id == id);
    if (!product) {
      console.error("Product not found:", id);
      return;
    }
    const isAlreadyInFavorites = FavoritesInStorage.some(
      (item) => item.id === id
    );
    if (isAlreadyInFavorites) {
      if (window.showNotification) {
        window.showNotification("هذا المنتج موجود بالفعل في المفضلة", "error");
      }
      return;
    }
    if (window.toggleFavorite) {
      window.toggleFavorite(product);
      FavoritesInStorage =
        JSON.parse(localStorage.getItem("Favorites_Products")) || [];
      updateFavoriteButton(id, true);
      if (
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname.endsWith("/")
      ) {
        updateFavoritesWidget();
      }
      if (window.showNotification) {
        window.showNotification("تمت إضافة المنتج إلى المفضلة", "success");
      }
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

// !!! Update favorites widget in header/sidebar
const updateFavoritesWidget = function () {
  const favoriteWidget = document.querySelector("#favorte-widget");
  if (!favoriteWidget) return;
  FavoritesInStorage =
    JSON.parse(localStorage.getItem("Favorites_Products")) || [];
  if (FavoritesInStorage.length === 0) {
    favoriteWidget.innerHTML = `
      <div class="favorites-empty">
        <span>لا توجد منتجات مفضلة</span>
      </div>
    `;
    return;
  }
  favoriteWidget.innerHTML = "";
  FavoritesInStorage.forEach((product) => {
    // Restored original structure for design compatibility
    const favoriteItem = `<div class="favorite-product" id="favorite-product-${product.id}">
      <div class="favorite-img-box">
        <img src="${product.Image}" alt="${product.name}" onclick="CreateProductPageId(${product.id})">
      </div>
      <div class="favorite-info">
        <h3 class="favorite-title" onclick="CreateProductPageId(${product.id})">${product.name}</h3>
        <span class="favorite-price">${formatPrice(product.price)} ريال سعودي</span>
        <div class="favorite-actions">
          <button class="add-to-cart-btn" onclick="addToCartFromFavorites(${product.id})">
            <i class="fas fa-shopping-cart"></i> إضافة للسلة
          </button>
          <button class="remove-favorite-btn" onclick="trashFavorite(${product.id})">
            <i class="fas fa-trash"></i> حذف من المفضلة
          </button>
        </div>
      </div>
    </div>`;
    favoriteWidget.insertAdjacentHTML("beforeend", favoriteItem);
  });
};

// !!! Remove product from favorites
const trashFavorite = function (id) {
  try {
    FavoritesInStorage = FavoritesInStorage.filter((item) => item.id !== id);
    localStorage.setItem(
      "Favorites_Products",
      JSON.stringify(FavoritesInStorage)
    );
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
    if (window.showNotification) {
      window.showNotification("تمت إزالة المنتج من المفضلة", "success");
    }
  } catch (error) {
    console.error("Error removing product from favorites:", error);
  }
};

// !!! Store favorite product in localStorage
const FavoritesProductsToStorage = function (product) {
  const exists = FavoritesInStorage.some((item) => item.id === product.id);
  if (exists) {
    return;
  }
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
};

// !!! Add product to cart from favorites
const addToCartFromFavorites = function (id) {
  try {
    const product = FavoritesInStorage.find((item) => item.id === id);
    if (!product) {
      console.error("Product not found in favorites:", id);
      return;
    }
    let cartProducts = getCartProducts();
    const existingProduct = cartProducts.find((p) => p.id === id);
    if (existingProduct) {
      existingProduct.quantity += 1;
      localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
      let quantityElement = document.querySelector(`#quantity-${id}`);
      if (quantityElement) {
        quantityElement.innerHTML = existingProduct.quantity;
      }
    } else {
      cartProducts.push({ ...product, quantity: 1 });
      localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
      if (typeof renderCartWidget === "function") {
        renderCartWidget(id);
      } else if (window.renderCartWidget) {
        window.renderCartWidget(id);
      }
    }
    if (typeof updateCartDisplay === "function") {
      updateCartDisplay(cartProducts);
    } else if (window.updateCartDisplay) {
      window.updateCartDisplay(cartProducts);
    }
    if (typeof openSidebar === "function") {
      openSidebar();
    } else if (window.openSidebar) {
      window.openSidebar();
    }
    console.log("Product added to cart from favorites:", product);
  } catch (error) {
    console.error("Error adding product to cart from favorites:", error);
  }
};

// !!! Update favorite button state for a product
const updateFavoriteButton = function (id, isFavorite) {
  const favButton = document.querySelector(`#favorite-a${id}`);
  if (!favButton) return;
  if (isFavorite) {
    favButton.innerHTML = `تمت الإضافة للمفضلة
      <i class="fa-regular fa-heart favorite" style="display:none"></i>
      <i class="fa-solid fa-heart favorite active-icon"></i>`;
  }
};

// !!! Draw favorites page (favorites.html)
const DrawFavoritesPage = function () {
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
  favoriteContainer = document.querySelector(".favorites-content");
  if (!favoriteContainer) {
    console.error("Favorites container not found");
    return;
  }
  FavoritesInStorage =
    JSON.parse(localStorage.getItem("Favorites_Products")) || [];
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
        <span class="favorite-price">${formatPrice(product.price)} ريال سعودي</span>
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

// !!! Initialize favorites page on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  console.log(
    "Favorites container exists:",
    !!document.querySelector(".favorites-content")
  );
  DrawFavoritesPage();
  console.log("Favorites page initialization complete");
});

// !!! Initialize favorites page on window load
window.addEventListener("load", function () {
  console.log("Window loaded");
  DrawFavoritesPage();
});
