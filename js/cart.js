// Validation functions
const validateQuantity = (quantity) => {
  const qty = parseInt(quantity);
  return !isNaN(qty) && qty > 0 && qty <= 99;
};

const validatePrice = (price) => {
  const value = parseFloat(price);
  return !isNaN(value) && value >= 0;
};

// Safe localStorage operations
const safeGetFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const safeSetToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Price calculation functions
const calculateCartTotal = (cartProducts) => {
  if (!cartProducts || cartProducts.length === 0) return 0;
  return cartProducts.reduce((total, item) => {
    const price = parseFloat(item.price);
    const qty = parseInt(item.quantity);
    if (validatePrice(price) && validateQuantity(qty)) {
      return total + price * qty;
    }
    return total;
  }, 0);
};

// Cart state management
const updateCartState = function (cartProducts) {
  try {
    // Update local storage
    safeSetToStorage("Cart_Products", cartProducts);

    // Update UI
    const total = calculateCartTotal(cartProducts);
    const itemCount = cartProducts.length;

    // Update total price displays
    document.querySelectorAll(".cart-total-price").forEach((el) => {
      if (el) el.textContent = `${formatPrice(total)} ريال سعودي`;
    });

    // Update cart counter
    if (HeaderCartCounter) {
      HeaderCartCounter.style.display = itemCount > 0 ? "block" : "none";
      HeaderCartCounter.textContent = itemCount;
    }

    // Update cart summary if on cart page
    if (window.location.pathname.endsWith("cart.html")) {
      updateCartSummary(cartProducts);
    }

    // Dispatch event for other components
    window.dispatchEvent(
      new CustomEvent("cartStateChanged", {
        detail: { total, itemCount, products: cartProducts },
      })
    );
  } catch (error) {
    console.error("Error updating cart state:", error);
  }
};

// Helper functions
const updateCartSummary = (cartProducts) => {
  const total = calculateCartTotal(cartProducts);

  // Update header total
  updateDomElement("#cart-total", `${formatPrice(total)} ريال سعودي`);

  // Update summary section
  updateDomElement("#products-total", `${formatPrice(total)} ريال سعودي`);
  updateDomElement("#final-total", `${formatPrice(total)} ريال سعودي`);

  // Show/hide summary section based on cart state
  const summarySection = document.querySelector(".cart-summary-section");
  if (summarySection) {
    summarySection.style.display = cartProducts.length === 0 ? "none" : "block";
  }
};

// Cart page functionality
const CartPageDraw = function () {
  if (!window.location.pathname.endsWith("cart.html")) return;

  try {
    const CartProducts = safeGetFromStorage("Cart_Products");

    if (!CartPageDom) return;

    if (!CartProducts.length) {
      CartPageDom.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-cart"></i>
          <h3>السلة فارغة</h3>
          <p>لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد</p>
          <a href="index.html" class="back-to-shop">
            <i class="fas fa-shopping-bag"></i>
            تصفح المنتجات
          </a>
        </div>`;
      return;
    }

    let cartHTML = CartProducts.map(
      (item) => `
      <div class="cart-table-data" id="product-${item.id}">
        <div class="cart-data-img-box">
          <img src="${item.Image}" alt="${item.name}" onclick="driveProducts(${
        item.id
      })">
        </div>
        <div class="cart-data-product-title">
          <span class="cart-title">${item.name}</span>
        </div>
        <div class="cart-data-price">
          <span class="cart-price">${formatPrice(item.price)} ريال سعودي</span>
        </div>
        <div class="cart-data-quantity">
          <button class="quantity-btn minus" onclick="updateQuantity(${
            item.id
          }, 'decrease')">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity" id="quantity-${item.id}">${
        item.quantity
      }</span>
          <button class="quantity-btn plus" onclick="updateQuantity(${
            item.id
          }, 'increase')">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="cart-data-delete">
          <button class="delete-btn" onclick="TrashFromCart_HomePage(${
            item.id
          })">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `
    ).join("");

    CartPageDom.innerHTML = cartHTML;
    updateCartSummary(CartProducts);
  } catch (error) {
    console.error("Error drawing cart page:", error);
    if (CartPageDom) {
      CartPageDom.innerHTML =
        '<div class="error">حدث خطأ في تحميل سلة التسوق</div>';
    }
  }
};

// Cart initialization
const initializeCart = () => {
  try {
    // Load cart state
    const cartProducts = safeGetFromStorage("Cart_Products");

    // Update UI
    restoreCartState();
    updateCartState(cartProducts);

    // Initialize cart page if we're on it
    if (window.location.pathname.endsWith("cart.html")) {
      CartPageDraw();
    }
  } catch (error) {
    console.error("Error initializing cart:", error);
  }
};

// Function to restore cart state
const restoreCartState = function () {
  const cartProducts = safeGetFromStorage("Cart_Products");

  if (SidebarUlDiv) {
    SidebarUlDiv.innerHTML = "";

    cartProducts.forEach((product) => {
      const productHtml = `
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
                                <i class="fa-regular fa-trash-can" onclick="TrashFromCart_HomePage(${
                                  product.id
                                })"></i>
                            </button>
                        </div>
                    </li>
                    <div class="cart-product-infos" id="product-div-${
                      product.id
                    }">
                        <span class="cart-product-infos-title">الكمية</span>
                        <span class="cart-product-quantite" id="quantity-${
                          product.id
                        }">${product.quantity}</span>
                        <span class="cart-product-price">${formatPrice(
                          product.price
                        )} ريال سعودي</span>
                    </div>
                </div>
            `;
      SidebarUlDiv.insertAdjacentHTML("beforeend", productHtml);
    });
  }
  updateCartDisplay(cartProducts);
};

// Listen for DOM ready
document.addEventListener("DOMContentLoaded", initializeCart);

// Listen for storage changes
window.addEventListener("storage", (e) => {
  if (e.key === "Cart_Products") {
    initializeCart();
  }
});

// Export functions
window.updateCartState = updateCartState;
window.CartPageDraw = CartPageDraw;
window.initializeCart = initializeCart;

// !!!!! functions to move into product page when user click on item
const driveProducts = function (id) {
  localStorage.setItem("Product_Id", id);

  setTimeout(function () {
    window.location = "product-page.html";
  }, 1000);
};

// !!!! function to increase | decrease the product quantity on Cart Page
const animateQuantityChange = (element, type) => {
  if (!element) return;
  element.classList.add("quantity-change");
  element.classList.add(type === "increase" ? "quantity-up" : "quantity-down");
  setTimeout(() => {
    element.classList.remove("quantity-change", "quantity-up", "quantity-down");
  }, 300);
};

const updateQuantity = function (id, operation) {
  try {
    let CartProducts = safeGetFromStorage("Cart_Products");
    const productIndex = CartProducts.findIndex((p) => p.id == id);

    if (productIndex !== -1) {
      const currentQty = CartProducts[productIndex].quantity;
      const newQty = operation === "increase" ? currentQty + 1 : currentQty - 1;

      if (validateQuantity(newQty)) {
        CartProducts[productIndex].quantity = newQty;
        const quantityElement = document.querySelector(`#quantity-${id}`);
        if (quantityElement) {
          animateQuantityChange(quantityElement, operation);
          quantityElement.textContent = newQty;
        }
        updateCartState(CartProducts);
        UpdateMainProducts(id, operation);
        showNotification("تم تحديث الكمية بنجاح", "success");
      } else {
        const limitMessage =
          operation === "increase"
            ? "لا يمكن زيادة الكمية أكثر من ذلك"
            : "الحد الأدنى للكمية هو 1";
        showNotification(limitMessage);
        const buttonSelector = `.cart-data-quantity .${
          operation === "increase" ? "plus" : "minus"
        }[onclick*="${id}"]`;
        const button = document.querySelector(buttonSelector);
        if (button) {
          button.classList.add("quantity-limit-reached");
          setTimeout(
            () => button.classList.remove("quantity-limit-reached"),
            1000
          );
        }
      }
    }
  } catch (error) {
    console.error(
      `Error ${
        operation === "increase" ? "increasing" : "decreasing"
      } quantity:`,
      error
    );
    showNotification("حدث خطأ في تحديث الكمية");
  }
};

const UpdateMainProducts = function (id, operation) {
  try {
    let oldProducts = safeGetFromStorage("NewProducts");
    if (!Array.isArray(oldProducts)) {
      console.warn("NewProducts is not an array, initializing empty array");
      oldProducts = [];
    }

    oldProducts = oldProducts.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          quantity:
            operation === "increase"
              ? (product.quantity || 0) + 1
              : Math.max((product.quantity || 0) - 1, 0),
        };
      }
      return product;
    });

    safeSetToStorage("NewProducts", oldProducts);
  } catch (error) {
    console.error("Error updating main products:", error);
    showNotification("حدث خطأ في تحديث الكمية");
  }
};

const changeSidebarQuantity = function (id, product) {
  let quantityElement = document.querySelector(`#quantity-${id}`);
  quantityElement.innerHTML = product.quantity;
};

// !!!! function to reset quantity of product if it deleted from cart
const resetQuantity = function (id) {
  // get from localstorage
  let NewDBProducts = safeGetFromStorage("NewProducts");

  // find product with the id
  NewDBProducts = NewDBProducts.map((product) => {
    if (product.id == id) {
      product.quantity = 1;
      console.log("الكمية تم إعادة تعيينها للمنتج:", product);
    }
    return product;
  });

  // set data into storage
  safeSetToStorage("NewProducts", NewDBProducts);
};

// !!! TRASH ICON FUNCTIONS TO DELETE THE PRODUCT FROM CART
const TrashFromCart_HomePage = function (id) {
  try {
    let cartProducts = safeGetFromStorage("Cart_Products");
    const productElement = document.querySelector(
      `#sidebar-product-container-${id}`
    );
    const cartPageElement = document.querySelector(`#product-${id}`);

    if (productElement) {
      productElement.style.transition = "all 0.3s ease";
      productElement.style.transform = "translateX(-100%)";
      productElement.style.opacity = "0";

      // Also animate cart page element if exists
      if (cartPageElement) {
        cartPageElement.style.transition = "all 0.3s ease";
        cartPageElement.style.transform = "translateX(100%)";
        cartPageElement.style.opacity = "0";
      }

      setTimeout(() => {
        productElement.remove();
        if (cartPageElement) cartPageElement.remove();

        cartProducts = cartProducts.filter((product) => product.id !== id);
        safeSetToStorage("Cart_Products", cartProducts);
        resetQuantity(id);
        updateCartState(cartProducts);
        showNotification("تم حذف المنتج من السلة", "success");

        // If cart is empty in cart page, show empty message
        if (
          window.location.pathname.endsWith("cart.html") &&
          cartProducts.length === 0
        ) {
          CartPageDraw();
        }
      }, 300);
    }
  } catch (error) {
    console.error("Error removing product:", error);
    showNotification("حدث خطأ في حذف المنتج", "error");
  }
};

const TrashFromCart_CartPage = function (id) {
  try {
    const productElement = document.querySelector(`.cart-table #product-${id}`);
    if (productElement) {
      productElement.classList.add("removing");
      setTimeout(() => {
        productElement.remove();
        TrashFromCart_HomePage(id);
      }, 300);
    }
  } catch (error) {
    console.error("Error removing product:", error);
    showNotification("حدث خطأ في حذف المنتج");
  }
};
