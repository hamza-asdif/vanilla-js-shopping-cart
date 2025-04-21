// !!! Validate quantity input
const validateQuantity = (quantity) => {
  const qty = parseInt(quantity);
  return !isNaN(qty) && qty > 0 && qty <= 99;
};

// !!! Validate price input
const validatePrice = (price) => {
  const value = parseFloat(price);
  return !isNaN(value) && value >= 0;
};

// !!! Get cart products from localStorage
const getCartProducts = () => JSON.parse(localStorage.getItem("Cart_Products")) || [];

// !!! Calculate total price for cart
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

// !!! Update content of a DOM element
const updateDomElementCart = (selector, content) => {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = content;
};

// !!! Update cart counter in header/sidebar
const updateCartCounter = function () {
  const cartProducts = JSON.parse(localStorage.getItem("Cart_Products")) || [];
  const itemCount = cartProducts.length;
  const HeaderCartCounter = document.querySelector(".cart-counter");
  const sidebarCartCounter = document.querySelector(".sidebar-header-span");
  if (HeaderCartCounter) {
    HeaderCartCounter.style.display = itemCount > 0 ? "block" : "none";
    HeaderCartCounter.innerHTML = itemCount;
  }
  if (sidebarCartCounter) {
    sidebarCartCounter.innerHTML = `${itemCount} عناصر`;
  }
  try {
    localStorage.setItem("Cart_Counter", JSON.stringify(itemCount));
  } catch (error) {
    console.error("Error updating cart counter in storage:", error);
  }
  return itemCount;
};

// !!! Update cart totals and state everywhere
const updateCartState = (cartProducts) => {
  try {
    const total = calculateCartTotal(cartProducts);
    updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart(".cart-span", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart("#cart-sum-span", `${formatPrice(total)} ريال سعودي`);
    updateCartCounter();
    try {
      localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
      localStorage.setItem("TotalPrice", JSON.stringify(total));
    } catch (error) {
      console.error("Error saving cart state:", error);
    }
  } catch (error) {
    console.error("Error updating cart state:", error);
  }
};

// !!! Draw cart page content (cart.html)
const drawCartPage = () => {
  console.log("Drawing cart page");
  const currentPage = window.location.pathname;
  const isCartPage = currentPage === '/' || currentPage === '/cart' || currentPage.includes('/cart.html');
  if (!isCartPage) {
    console.log("Not on cart page, path:", currentPage);
    return;
  }
  const cartContainer = document.querySelector(".cart-table");
  if (!cartContainer) {
    console.error("Cart container not found");
    return;
  }
  const cartProducts = getCartProducts();
  console.log("Cart products:", cartProducts);
  if (!cartProducts.length) {
    const cartParent = document.querySelector(".cart");
    if (cartParent) {
      cartParent.innerHTML = `
        <div class="empty-cart">
          <i class="fa-solid fa-shopping-cart"></i>
          <h2>سلة التسوق فارغة</h2>
          <p>قم بإضافة منتجات إلى سلة التسوق لتظهر هنا</p>
          <a href="index.html" class="back-to-shop">العودة للتسوق</a>
        </div>
      `;
    }
    updateDomElementCart("#products-total", "0 ريال سعودي");
    updateDomElementCart("#final-total", "0 ريال سعودي");
    return;
  }
  const cartItemsHTML = cartProducts.map((product, index) => `
    <div class="cart-table-data" id="cart-item-${product.id}">
      <div class="cart-data-img-box">
        <img src="${product.Image}" alt="${product.name}" onclick="CreateProductPageId(${product.id})">
      </div>
      <div class="cart-data-details">
        <h3 class="cart-item-title" onclick="CreateProductPageId(${product.id})">${product.name}</h3>
        <div class="cart-item-price">${formatPrice(product.price)} ريال سعودي</div>
      </div>
      <div class="cart-data-quantity">
        <div class="quantity-control">
          <button class="quantity-decrease" onclick="decreaseQuantity(${product.id})">-</button>
          <input type="number" min="1" max="99" value="${product.quantity}" 
            onchange="updateItemQuantity(${product.id}, this.value)" 
            class="quantity-input" id="quantity-input-${product.id}">
          <button class="quantity-increase" onclick="increaseQuantity(${product.id})">+</button>
        </div>
      </div>
      <div class="cart-data-price">
        <span>${formatPrice(product.price * product.quantity)} ريال سعودي</span>
      </div>
      <div class="cart-data-trash">
        <button class="remove-item" onclick="removeCartItem(${product.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join("");
  cartContainer.innerHTML = cartItemsHTML;
  const total = calculateCartTotal(cartProducts);
  updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
  updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
};

// !!! Increase item quantity in cart
const increaseQuantity = (id) => {
  const cartProducts = getCartProducts();
  const product = cartProducts.find(p => p.id === id);
  if (product && product.quantity < 99) {
    product.quantity += 1;
    try {
      localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
    } catch (error) {
      console.error("Error updating cart products:", error);
    }
    const quantityInput = document.querySelector(`#quantity-input-${id}`);
    if (quantityInput) quantityInput.value = product.quantity;
    const subtotal = document.querySelector(`#cart-item-${id} .cart-data-price span`);
    if (subtotal) subtotal.textContent = `${formatPrice(product.price * product.quantity)} ريال سعودي`;
    const total = calculateCartTotal(cartProducts);
    updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
    const sidebarQuantity = document.querySelector(`#quantity-${id}`);
    if (sidebarQuantity) sidebarQuantity.innerHTML = product.quantity;
    if (typeof window.updateCartDisplay === 'function') {
      window.updateCartDisplay(cartProducts);
    } else {
      updateCartState(cartProducts);
    }
  }
};

// !!! Decrease item quantity in cart
const decreaseQuantity = (id) => {
  const cartProducts = getCartProducts();
  const product = cartProducts.find(p => p.id === id);
  if (product && product.quantity > 1) {
    product.quantity -= 1;
    try {
      localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
    } catch (error) {
      console.error("Error updating cart products:", error);
    }
    const quantityInput = document.querySelector(`#quantity-input-${id}`);
    if (quantityInput) quantityInput.value = product.quantity;
    const subtotal = document.querySelector(`#cart-item-${id} .cart-data-price span`);
    if (subtotal) subtotal.textContent = `${formatPrice(product.price * product.quantity)} ريال سعودي`;
    const total = calculateCartTotal(cartProducts);
    updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
    const sidebarQuantity = document.querySelector(`#quantity-${id}`);
    if (sidebarQuantity) sidebarQuantity.innerHTML = product.quantity;
    if (typeof window.updateCartDisplay === 'function') {
      window.updateCartDisplay(cartProducts);
    } else {
      updateCartState(cartProducts);
    }
  }
};

// !!! Update item quantity in cart
const updateItemQuantity = (id, value) => {
  const quantity = parseInt(value);
  if (!validateQuantity(quantity)) {
    console.error("Invalid quantity:", quantity);
    return;
  }
  const cartProducts = getCartProducts();
  const product = cartProducts.find(p => p.id === id);
  if (product) {
    const oldQuantity = product.quantity;
    product.quantity = quantity;
    try {
      localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
    } catch (error) {
      console.error("Error updating cart products:", error);
    }
    const subtotal = document.querySelector(`#cart-item-${id} .cart-data-price span`);
    if (subtotal) subtotal.textContent = `${formatPrice(product.price * product.quantity)} ريال سعودي`;
    const total = calculateCartTotal(cartProducts);
    updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
    const sidebarQuantity = document.querySelector(`#quantity-${id}`);
    if (sidebarQuantity) sidebarQuantity.innerHTML = product.quantity;
    if (typeof window.updateCartDisplay === 'function') {
      window.updateCartDisplay(cartProducts);
    } else {
      updateCartState(cartProducts);
    }
    console.log(`Quantity updated from ${oldQuantity} to ${quantity} for product ${id}`);
  }
};

// !!! Remove item from cart
const removeCartItem = (id) => {
  let cartProducts = getCartProducts();
  const productToRemove = cartProducts.find(p => p.id === id);
  if (!productToRemove) return;
  cartProducts = cartProducts.filter(p => p.id !== id);
  try {
    localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
  } catch (error) {
    console.error("Error removing cart item:", error);
  }
  const cartItem = document.querySelector(`#cart-item-${id}`);
  if (cartItem) {
    cartItem.classList.add('removing');
    setTimeout(() => {
      cartItem.remove();
      if (cartProducts.length === 0) {
        drawCartPage();
      }
    }, 300);
  }
  const sidebarItem = document.querySelector(`#sidebar-product-container-${id}`);
  if (sidebarItem) {
    sidebarItem.remove();
  }
  const total = calculateCartTotal(cartProducts);
  updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
  updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
  if (typeof window.updateCartDisplay === 'function') {
    window.updateCartDisplay(cartProducts);
  } else {
    updateCartState(cartProducts);
  }
  console.log(`Product ${id} removed from cart`);
};

// !!! Remove item from cart (home page)
const TrashFromCart_HomePage = function (id) {
  try {
    let cartProducts = getCartProducts();
    const productElement = document.querySelector(`#sidebar-product-container-${id}`);
    if (productElement) {
      productElement.style.transition = "all 0.3s ease";
      productElement.style.transform = "translateX(100%)";
      productElement.style.opacity = "0";
      setTimeout(() => {
        productElement.remove();
        cartProducts = cartProducts.filter(product => product.id !== id);
        try {
          localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
        } catch (error) {
          console.error("Error updating cart products:", error);
        }
        updateCartState(cartProducts);
        if (window.showNotification) {
          window.showNotification("تم حذف المنتج من السلة", "success");
        }
      }, 300);
    }
  } catch (error) {
    console.error("Error removing product from cart (home page):", error);
  }
};

// !!! Restore cart state from storage
const restoreCartState = function () {
  const cartProducts = JSON.parse(localStorage.getItem("Cart_Products")) || [];
  const SidebarUlDiv = document.querySelector(".ul-product-dom");
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
              <span class="cart-product-title" onclick="CreateProductPageId(${product.id})">
                ${product.name}
              </span>
            </a>
            <div class="cart-product-icons">
              <button type="button">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button">
                <i class="fa-regular fa-trash-can" onclick="TrashFromCart_HomePage(${product.id})"></i>
              </button>
            </div>
          </li>
          <div class="cart-product-infos" id="product-div-${product.id}">
            <span class="cart-product-infos-title">الكمية</span>
            <span class="cart-product-quantite" id="quantity-${product.id}">${product.quantity}</span>
            <span class="cart-product-price">${formatPrice(product.price)} ريال سعودي</span>
          </div>
        </div>
      `;
      SidebarUlDiv.insertAdjacentHTML("beforeend", productHtml);
    });
  }
  updateCartState(cartProducts);
};

// !!! Initialize cart page on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded for cart page");
  console.log("Current path:", window.location.pathname);
  const currentPage = window.location.pathname;
  const isCartPage = currentPage === '/' || currentPage === '/cart' || currentPage.includes('/cart.html');
  if (!isCartPage) {
    console.log("Not on cart page, path:", currentPage);
    return;
  }
  drawCartPage();
  const cartProducts = getCartProducts();
  const total = calculateCartTotal(cartProducts);
  updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
  updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
});

// !!! Initialize cart page on window load
window.addEventListener("load", function() {
  console.log("Window loaded for cart page");
  const currentPage = window.location.pathname;
  const isCartPage = currentPage === '/' || currentPage === '/cart' || currentPage.includes('/cart.html');
  if (!isCartPage) {
    console.log("Not on cart page, path:", currentPage);
    return;
  }
  drawCartPage();
});
