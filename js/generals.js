// !!! DOM Elements
let SidebarUlDiv = document.querySelector(".ul-product-dom");
let SideBar = document.querySelector(".cart-sidebar");
let SidebarClose = document.querySelector("#close-sidebar");
let CartHeaderLink = document.querySelector(".cart-link");
let sidebarCartSumDom = document.querySelector("#cart-sum-span");
let HeaderCartSumDom = document.querySelector(".cart-span");
let HeaderCartCounter = document.querySelector(".cart-counter");
let sidebarCartCounter = document.querySelector(".sidebar-header-span");

let CartPageDom = document.querySelector(".cart-table");
let SearchIcon = document.querySelector("#search-a");
let SearchBar = document.querySelector(".search-box");
let searchInput = document.querySelector("#search");
let searchPageDom = document.querySelector("#search-product-dom");
let searchEmptyDom = document.querySelector(".search-empty");
let Overlay = document.querySelector(".overlay");
let favoriteWidget = document.querySelector("#favorte-widget");

// !!! Helper function to format prices
const formatPrice = (price) => {
  const num = Number(price);
  return num % 1 === 0 ? num.toString() : num.toFixed(2);
};

// !!! Notification System
window.showNotification = (message, type = "error") => {
  const existingNotification = document.querySelector(
    ".cart-error-message, .cart-success-message"
  );
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className =
    type === "error" ? "cart-error-message" : "cart-success-message";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// !!! Update DOM elements with error handling
const updateDomElement = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.innerHTML = value;
  }
};

// !!! Helper to safely get localStorage values
const safeLocalStorageGet = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return defaultValue;
  }
};

// !!! Helper to safely set localStorage values
const safeLocalStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
    showNotification("حدث خطأ في حفظ البيانات");
    return false;
  }
};

// !!! Sidebar Animation Management with error handling
const ANIMATION_DURATION = 300;
let sidebarAnimationTimeout;
let isAnimating = false;

// !!! Open sidebar
const openSidebar = function () {
  if (isAnimating || !SideBar) return;

  try {
    isAnimating = true;
    SideBar.style.transition = `transform ${ANIMATION_DURATION}ms ease-out`;
    SideBar.style.transform = "translateX(0px)";
    document.body.style.overflow = "hidden";
    if (Overlay) Overlay.style.display = "block";

    setTimeout(() => {
      isAnimating = false;
    }, ANIMATION_DURATION);
  } catch (error) {
    console.error("Error opening sidebar:", error);
    isAnimating = false;
  }
};

// !!! Close sidebar
const closeSidebar = function () {
  if (isAnimating || !SideBar) return;

  try {
    isAnimating = true;
    SideBar.style.transform = "translateX(-100%)";
    document.body.style.overflow = "";
    if (Overlay) Overlay.style.display = "none";

    setTimeout(() => {
      SideBar.style.transition = "";
      isAnimating = false;
    }, ANIMATION_DURATION);
  } catch (error) {
    console.error("Error closing sidebar:", error);
    isAnimating = false;
  }
};

// !!! Update cart display
window.updateCartDisplay = function (cartProducts = []) {
  try {
    const total = cartProducts.reduce(
      (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity),
      0
    );

    if (sidebarCartSumDom)
      sidebarCartSumDom.innerHTML = `${formatPrice(total)} ريال سعودي`;
    if (HeaderCartSumDom)
      HeaderCartSumDom.innerHTML = `${formatPrice(total)} ريال سعودي`;

    const itemCount = cartProducts.length;
    if (HeaderCartCounter) {
      HeaderCartCounter.style.display = itemCount > 0 ? "block" : "none";
      HeaderCartCounter.innerHTML = itemCount;
    }
    if (sidebarCartCounter) {
      sidebarCartCounter.innerHTML = `${itemCount} عناصر`;
    }

    safeLocalStorageSet("Cart_Products", cartProducts);
    safeLocalStorageSet("TotalPrice", total);
    safeLocalStorageSet("Cart_Counter", itemCount);
  } catch (error) {
    console.error("Error updating cart display:", error);
  }
};

// !!! Event Listeners
if (CartHeaderLink) {
  CartHeaderLink.addEventListener("click", function (e) {
    e.preventDefault();
    openSidebar();
  });
}

if (SidebarClose) {
  SidebarClose.addEventListener("click", closeSidebar);
}

if (Overlay) {
  Overlay.addEventListener("click", closeSidebar);
}

// !!! Close sidebar on escape key
document.addEventListener("keydown", function (e) {
  if (
    e.key === "Escape" &&
    SideBar &&
    SideBar.style.transform === "translateX(0px)"
  ) {
    closeSidebar();
  }
});

// !!! Error handling for cart operations
window.addEventListener("error", function (e) {
  console.error("Cart operation error:", e.error);
  // !!! Show user-friendly error message
  showNotification("حدث خطأ. يرجى المحاولة مرة أخرى");
});

// !!! Mobile Menu Toggle
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menuBox = document.querySelector(".menu-box");
  const mobileOverlay = document.querySelector(".mobile-overlay");

  if (menuToggle && menuBox && mobileOverlay) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      menuBox.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
      document.body.style.overflow = menuBox.classList.contains("active")
        ? "hidden"
        : "";
    });

    mobileOverlay.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      menuBox.classList.remove("active");
      mobileOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });

    // !!! Close menu on window resize if screen becomes larger
    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        menuToggle.classList.remove("active");
        menuBox.classList.remove("active");
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
};

// !!! Initialize mobile menu on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initMobileMenu);
