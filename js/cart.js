// Validation functions
const validateQuantity = (quantity) => {
  const qty = parseInt(quantity);
  return !isNaN(qty) && qty > 0 && qty <= 99;
};

const validatePrice = (price) => {
  const value = parseFloat(price);
  return !isNaN(value) && value >= 0;
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

// Cart counter management
const updateCartCounter = function () {
  const cartProducts = safeLocalStorageGet("Cart_Products", []);
  const itemCount = cartProducts.length;

  if (HeaderCartCounter) {
    HeaderCartCounter.style.display = itemCount > 0 ? "block" : "none";
    HeaderCartCounter.innerHTML = itemCount;
  }

  if (sidebarCartCounter) {
    sidebarCartCounter.innerHTML = `${itemCount} عناصر`;
  }

  safeLocalStorageSet("Cart_Counter", itemCount);
  return itemCount;
};

const updateCartState = (cartProducts) => {
  try {
    const total = calculateCartTotal(cartProducts);
    updateDomElement(".cart-span", `${formatPrice(total)} ريال سعودي`);
    updateDomElement("#cart-sum-span", `${formatPrice(total)} ريال سعودي`);
    updateCartCounter();
    safeLocalStorageSet("Cart_Products", cartProducts);
    safeLocalStorageSet("TotalPrice", total);
  } catch (error) {
    console.error("Error updating cart state:", error);
    showNotification("حدث خطأ في تحديث السلة");
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

// Cart page drawing function
const CartPageDraw = function () {
  if (window.location.pathname.endsWith("cart.html")) {
    let CartProducts = JSON.parse(localStorage.getItem("Cart_Products")) || [];
    let cartHTML = "";

    try {
      if (CartProducts.length === 0) {
        cartHTML = `
          <div class="cart-empty">
              <i class="fas fa-shopping-cart"></i>
              <h3>السلة فارغة</h3>
              <p>لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد</p>
              <a href="index.html" class="back-to-shop">
                  <i class="fas fa-shopping-bag"></i>
                  تصفح المنتجات
              </a>
          </div>`;
      } else {
        CartProducts.forEach((item) => {
          cartHTML += `<div class="cart-table-data" id="product-${item.id}">
              <div class="cart-data-img-box">
                  <img src="${item.Image}" alt="${
            item.name
          }" onclick="driveProducts(${item.id})">
              </div>
              <div class="cart-data-product-title">
                  <h4 class="cart-data-title" onclick="driveProducts(${
                    item.id
                  })">${item.name}</h4>
              </div>
              <div class="cart-data-quantity">
                  <i class="fa-solid fa-plus" onclick="IncreaseQuantity(${
                    item.id
                  })"></i>
                  <span class="quantity-span-${item.id}">${item.quantity}</span>
                  <i class="fa-solid fa-minus" onclick="decreaseQuantity(${
                    item.id
                  })"></i>
              </div>
              <div class="cart-data-price">
                  <span class="product-price">${formatPrice(
                    item.price
                  )} ريال سعودي</span>
              </div>
              <div class="cart-data-trash">
                  <i class="fa-regular fa-trash-can" onclick="TrashFromCart_CartPage(${
                    item.id
                  })"></i>
              </div>
          </div>`;
        });
      }

      CartPageDom.innerHTML = cartHTML;
      updateCartSummary(CartProducts);
      updateCartState(CartProducts);
    } catch (error) {
      console.error("Error drawing cart page:", error);
      CartPageDom.innerHTML =
        '<div class="cart-error">حدث خطأ أثناء تحميل سلة التسوق</div>';
    }
  }
};
CartPageDraw();

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

const IncreaseQuantity = function (id) {
  try {
    let CartProducts = safeLocalStorageGet("Cart_Products", []);
    const productIndex = CartProducts.findIndex((p) => p.id == id);

    if (productIndex !== -1) {
      const newQty = CartProducts[productIndex].quantity + 1;
      if (validateQuantity(newQty)) {
        CartProducts[productIndex].quantity = newQty;
        const quantityElement = document.querySelector(`.quantity-span-${id}`);
        if (quantityElement) {
          animateQuantityChange(quantityElement, "increase");
          quantityElement.textContent = newQty;
        }
        updateCartState(CartProducts);
        UpdateMainProducts(id, "increase");
        showNotification("تم تحديث الكمية بنجاح", "success");
      } else {
        showNotification("لا يمكن زيادة الكمية أكثر من ذلك");
        const plusButton = document.querySelector(
          `.cart-data-quantity i.fa-plus[onclick*="${id}"]`
        );
        if (plusButton) {
          plusButton.classList.add("quantity-limit-reached");
          setTimeout(
            () => plusButton.classList.remove("quantity-limit-reached"),
            1000
          );
        }
      }
    }
  } catch (error) {
    console.error("Error increasing quantity:", error);
    showNotification("حدث خطأ في تحديث الكمية");
  }
};

const decreaseQuantity = function (id) {
  try {
    let CartProducts = safeLocalStorageGet("Cart_Products", []);
    const productIndex = CartProducts.findIndex((p) => p.id == id);

    if (productIndex !== -1) {
      if (CartProducts[productIndex].quantity > 1) {
        CartProducts[productIndex].quantity -= 1;
        updateDomElement(
          `.quantity-span-${id}`,
          CartProducts[productIndex].quantity
        );
        updateCartState(CartProducts);
        UpdateMainProducts(id, "decrease");
        showNotification("تم تحديث الكمية بنجاح", "success");
      } else {
        showNotification("الحد الأدنى للكمية هو 1");
        const minusButton = document.querySelector(
          `.cart-data-quantity i.fa-minus[onclick*="${id}"]`
        );
        if (minusButton) {
          minusButton.classList.add("quantity-limit-reached");
          setTimeout(
            () => minusButton.classList.remove("quantity-limit-reached"),
            1000
          );
        }
      }
    }
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    showNotification("حدث خطأ في تحديث الكمية");
  }
};

const UpdateMainProducts = function (id, operation) {
  try {
    let oldProducts = safeLocalStorageGet("NewProducts", []);
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

    safeLocalStorageSet("NewProducts", oldProducts);
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
  let NewDBProducts = JSON.parse(localStorage.getItem("NewProducts")) || [];

  // find product with the id
  NewDBProducts = NewDBProducts.map((product) => {
    if (product.id == id) {
      product.quantity = 1;
      console.log("الكمية تم إعادة تعيينها للمنتج:", product);
    }
    return product;
  });

  // set data into storage
  localStorage.setItem("NewProducts", JSON.stringify(NewDBProducts));
};

// !!! TRASH ICON FUNCTIONS TO DELETE THE PRODUCT FROM CART
const TrashFromCart_HomePage = function (id) {
  try {
    let cartProducts = safeLocalStorageGet("Cart_Products", []);
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
        safeLocalStorageSet("Cart_Products", cartProducts);
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

// Function to restore cart state
const restoreCartState = function () {
  const cartProducts = JSON.parse(localStorage.getItem("Cart_Products")) || [];

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

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", function () {
  restoreCartState();
});
