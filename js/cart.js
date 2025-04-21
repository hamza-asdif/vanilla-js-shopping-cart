// Validation functions
const validateQuantity = (quantity) => {
  const qty = parseInt(quantity);
  return !isNaN(qty) && qty > 0 && qty <= 99;
};

const validatePrice = (price) => {
  const value = parseFloat(price);
  return !isNaN(value) && value >= 0;
};

// Get cart products from localStorage
const getCartProducts = () => JSON.parse(localStorage.getItem("Cart_Products")) || [];

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

// DOM update helper
const updateDomElementCart = (selector, content) => {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = content;
};

// Cart counter management
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
    console.error("Error updating cart counter:", error);
  }
  
  return itemCount;
};

const updateCartState = (cartProducts) => {
  try {
    const total = calculateCartTotal(cartProducts);
    
    // Update cart page totals
    updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
    
    // Update header and sidebar totals
    updateDomElementCart(".cart-span", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart("#cart-sum-span", `${formatPrice(total)} ريال سعودي`);
    
    // Update cart counter
    updateCartCounter();
    
    try {
      localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
      localStorage.setItem("TotalPrice", JSON.stringify(total));
    } catch (error) {
      console.error("Error updating cart state in localStorage:", error);
    }
  } catch (error) {
    console.error("Error updating cart state:", error);
  }
};

// Draw cart page
const drawCartPage = () => {
  if (!window.location.pathname.includes("cart.html")) return;
  
  console.log("Drawing cart page");
  
  // Update the selector to match the actual HTML structure
  const cartContainer = document.querySelector(".cart-table");
  if (!cartContainer) {
    console.error("Cart container not found");
    return;
  }
  
  const cartProducts = getCartProducts();
  console.log("Cart products:", cartProducts);
  
  if (!cartProducts.length) {
    // Update the parent container to show empty cart message
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
  
  // Update cart total
  const total = calculateCartTotal(cartProducts);
  updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
  updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
};

// Cart item quantity management
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
    
    // Update UI in cart page
    const quantityInput = document.querySelector(`#quantity-input-${id}`);
    if (quantityInput) quantityInput.value = product.quantity;
    
    const subtotal = document.querySelector(`#cart-item-${id} .cart-data-price span`);
    if (subtotal) subtotal.textContent = `${formatPrice(product.price * product.quantity)} ريال سعودي`;
    
    // Update cart totals on cart page
    const total = calculateCartTotal(cartProducts);
    updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
    
    // Update sidebar quantity if it exists
    const sidebarQuantity = document.querySelector(`#quantity-${id}`);
    if (sidebarQuantity) sidebarQuantity.innerHTML = product.quantity;
    
    // Update all cart displays using the global function if available
    if (typeof window.updateCartDisplay === 'function') {
      window.updateCartDisplay(cartProducts);
    } else {
      updateCartState(cartProducts);
    }
  }
};

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
    
    // Update UI in cart page
    const quantityInput = document.querySelector(`#quantity-input-${id}`);
    if (quantityInput) quantityInput.value = product.quantity;
    
    const subtotal = document.querySelector(`#cart-item-${id} .cart-data-price span`);
    if (subtotal) subtotal.textContent = `${formatPrice(product.price * product.quantity)} ريال سعودي`;
    
    // Update cart totals on cart page
    const total = calculateCartTotal(cartProducts);
    updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
    
    // Update sidebar quantity if it exists
    const sidebarQuantity = document.querySelector(`#quantity-${id}`);
    if (sidebarQuantity) sidebarQuantity.innerHTML = product.quantity;
    
    // Update all cart displays using the global function if available
    if (typeof window.updateCartDisplay === 'function') {
      window.updateCartDisplay(cartProducts);
    } else {
      updateCartState(cartProducts);
    }
  }
};

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
    
    // Update UI in cart page
    const subtotal = document.querySelector(`#cart-item-${id} .cart-data-price span`);
    if (subtotal) subtotal.textContent = `${formatPrice(product.price * product.quantity)} ريال سعودي`;
    
    // Update cart totals on cart page
    const total = calculateCartTotal(cartProducts);
    updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
    updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
    
    // Update sidebar quantity if it exists
    const sidebarQuantity = document.querySelector(`#quantity-${id}`);
    if (sidebarQuantity) sidebarQuantity.innerHTML = product.quantity;
    
    // Update all cart displays using the global function if available
    if (typeof window.updateCartDisplay === 'function') {
      window.updateCartDisplay(cartProducts);
    } else {
      updateCartState(cartProducts);
    }
    
    console.log(`Quantity updated from ${oldQuantity} to ${quantity} for product ${id}`);
  }
};

const removeCartItem = (id) => {
  let cartProducts = getCartProducts();
  
  // Find the product to be removed
  const productToRemove = cartProducts.find(p => p.id === id);
  if (!productToRemove) return;
  
  // Remove from cart products array
  cartProducts = cartProducts.filter(p => p.id !== id);
  
  try {
    localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
  } catch (error) {
    console.error("Error updating cart products:", error);
  }
  
  // Add animation class before removing
  const cartItem = document.querySelector(`#cart-item-${id}`);
  if (cartItem) {
    cartItem.classList.add('removing');
    setTimeout(() => {
      cartItem.remove();
      
      // If cart is empty, redraw the cart page
      if (cartProducts.length === 0) {
        drawCartPage();
      }
    }, 300);
  }
  
  // Remove from sidebar if it exists
  const sidebarItem = document.querySelector(`#sidebar-product-container-${id}`);
  if (sidebarItem) {
    sidebarItem.remove();
  }
  
  // Update cart totals on cart page
  const total = calculateCartTotal(cartProducts);
  updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
  updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
  
  // Update all cart displays using the global function if available
  if (typeof window.updateCartDisplay === 'function') {
    window.updateCartDisplay(cartProducts);
  } else {
    updateCartState(cartProducts);
  }
  
  console.log(`Product ${id} removed from cart`);
};

// Function to remove item from cart
const TrashFromCart_HomePage = function (id) {
  try {
    let cartProducts = getCartProducts();
    
    // Remove product from DOM
    const productElement = document.querySelector(`#sidebar-product-container-${id}`);
    if (productElement) {
      productElement.style.transition = "all 0.3s ease";
      productElement.style.transform = "translateX(-100%)";
      productElement.style.opacity = "0";
      
      setTimeout(() => {
        productElement.remove();
        
        // Update cart data
        cartProducts = cartProducts.filter(product => product.id !== id);
        
        try {
          localStorage.setItem("Cart_Products", JSON.stringify(cartProducts));
        } catch (error) {
          console.error("Error updating cart products:", error);
        }
        
        updateCartState(cartProducts);
        
        // Show notification if available
        if (window.showNotification) {
          window.showNotification("تم حذف المنتج من السلة", "success");
        }
      }, 300);
    }
  } catch (error) {
    console.error("Error removing product:", error);
    if (window.showNotification) {
      window.showNotification("حدث خطأ في حذف المنتج", "error");
    }
  }
};

// Function to restore cart state
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

// Initialize cart page
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded for cart page");
  console.log("Current path:", window.location.pathname);
  
  // Draw cart page
  drawCartPage();
  
  // Update cart totals
  const cartProducts = getCartProducts();
  const total = calculateCartTotal(cartProducts);
  updateDomElementCart("#products-total", `${formatPrice(total)} ريال سعودي`);
  updateDomElementCart("#final-total", `${formatPrice(total)} ريال سعودي`);
});

// Also check when window loads (in case DOMContentLoaded was missed)
window.addEventListener("load", function() {
  console.log("Window loaded for cart page");
  drawCartPage();
});
