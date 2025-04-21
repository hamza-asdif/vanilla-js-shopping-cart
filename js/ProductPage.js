// !!! functions to draw Products From Cart into Product Page

// Get the product page DOM element
const ProductPageDom = document.querySelector(".product-ui");

const ProductPageUI = function () {
  // Get the product ID from localStorage
  let ProductId_Storage = localStorage.getItem("Product_Id") || "";
  console.log("Product ID from storage:", ProductId_Storage);
  
  // Get products using the getProducts function from mydata.js
  const products = window.getProducts ? window.getProducts() : 
                  (JSON.parse(localStorage.getItem("Products")) || []);
  
  console.log("Products available:", products.length);
  
  // Find the product with the matching ID
  const product = products.find(p => p.id == ProductId_Storage);
  
  if (product) {
    console.log("Found product:", product.name);
    
    let Prod = `<div class="product__gallery">
                  <div class="product__gallery-main">
                      <img src="${product.Image}" alt="${product.name}" class="product__gallery-image">
                  </div>

                  <div class="product__gallery-thumbs">
                      <img src="${product.Image}" alt="${product.name}" class="product__gallery-thumb">
                      <img src="${product.Image}" alt="${product.name}" class="product__gallery-thumb">
                      <img src="${product.Image}" alt="${product.name}" class="product__gallery-thumb">
                      <img src="${product.Image}" alt="${product.name}" class="product__gallery-thumb">
                  </div>
              </div>

              <div class="product__info">
                  <h2 class="product__info-title">${product.name}</h2>
                  <div class="product__info-prices">
                      <span class="product__info-price">${product.price} ريال سعودي</span>
                      <span class="product__info-price--old">${Math.round(product.price * 1.2)} ريال سعودي</span>
                  </div>
                  <span class="product__checkout-title">للطلب يرجى إدخال معلوماتك في الخانات أسفله</span>
                  <form action="" class="product__form">
                      <div class="product__form-inputs">
                         <input type="text" class="product__form-input" placeholder="الاسم بالكامل" required>
                         <input type="text" class="product__form-input" placeholder="رقم الهاتف" required>
                         <input type="text" class="product__form-input" placeholder="المدينة" required>
                         <input type="text" class="product__form-input" placeholder="العنوان" required>
                      </div>
                  </form>

                  <a class="product__cta">
                      <form action="">
                      <i class="fa-solid fa-cart-plus product__cta-icon"></i>
                      <input type="submit" class="product__cta-button" value="لتأكيد الطلب اضغط هنا">
                      </form>
                  </a>
                  <div class="product__stats">
                      <span class="product__stats-visitors">🔥أكثر من 2500 زبون راض عن هذا المنتج🔥</span>
                      <span class="product__stats-counter">👁‍🗨 يشاهده <span class="product__stats-number">48</span> زبون في الوقت
                          الحالي.</span>
                  </div>
              </div>`;

    if (ProductPageDom) {
      ProductPageDom.innerHTML = Prod;
      
      // Add event listeners for thumbnail images
      document.querySelectorAll('.product__gallery-thumb').forEach(img => {
        img.addEventListener('click', function() {
          document.querySelector('.product__gallery-image').src = this.src;
        });
      });
      
      // Update fake visitor counter randomly
      setInterval(() => {
        const visitorCounter = document.querySelector('.product__stats-number');
        if (visitorCounter) {
          const randomVisitors = Math.floor(Math.random() * 30) + 30;
          visitorCounter.textContent = randomVisitors;
        }
      }, 8000);
    } else {
      console.error("Product page DOM element not found");
    }
  } else {
    console.error("Product not found with ID:", ProductId_Storage);
    if (ProductPageDom) {
      ProductPageDom.innerHTML = `
        <div class="product-not-found">
          <h2>المنتج غير موجود</h2>
          <p>عذراً، لم يتم العثور على المنتج المطلوب</p>
          <a href="index.html" class="back-to-shop">العودة للتسوق</a>
        </div>
      `;
    }
  }
};

// Wait for products to be loaded
window.addEventListener("productsLoaded", ProductPageUI);

// Also run on page load in case products are already loaded
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded, initializing product page");
  setTimeout(ProductPageUI, 100); // Small delay to ensure everything is loaded
});

// Handle second products if needed
const SecondProductPageUI = function () {
  let secondProductId_Storage = localStorage.getItem("Second_Product_Id") || "";
  
  // Get second products using the getSecondProducts function from mydata.js
  const secondProducts = window.getSecondProducts ? window.getSecondProducts() :
                        (JSON.parse(localStorage.getItem("Second_Products")) || []);
  
  // Find the product with the matching ID
  const product = secondProducts.find(p => p.id == secondProductId_Storage);
  
  if (product && ProductPageDom) {
    let Prod = `<div class="product__gallery">
                  <div class="product__gallery-main">
                      <img src="${product.Image}" alt="${product.name}" class="product__gallery-image">
                  </div>

                  <div class="product__gallery-thumbs">
                      <img src="${product.Image}" alt="${product.name}" class="product__gallery-thumb">
                      <img src="${product.Image}" alt="${product.name}" class="product__gallery-thumb">
                      <img src="${product.Image}" alt="${product.name}" class="product__gallery-thumb">
                      <img src="${product.Image}" alt="${product.name}" class="product__gallery-thumb">
                  </div>
              </div>

              <div class="product__info">
                  <h2 class="product__info-title">${product.name}</h2>
                  <div class="product__info-prices">
                      <span class="product__info-price">${product.price} ريال سعودي</span>
                      <span class="product__info-price--old">${Math.round(product.price * 1.2)} ريال سعودي</span>
                  </div>
                  <span class="product__checkout-title">للطلب يرجى إدخال معلوماتك في الخانات أسفله</span>
                  <form action="" class="product__form">
                      <div class="product__form-inputs">
                         <input type="text" class="product__form-input" placeholder="الاسم بالكامل" required>
                         <input type="text" class="product__form-input" placeholder="رقم الهاتف" required>
                         <input type="text" class="product__form-input" placeholder="المدينة" required>
                         <input type="text" class="product__form-input" placeholder="العنوان" required>
                      </div>
                  </form>

                  <a class="product__cta">
                      <form action="">
                      <i class="fa-solid fa-cart-plus product__cta-icon"></i>
                      <input type="submit" class="product__cta-button" value="لتأكيد الطلب اضغط هنا">
                      </form>
                  </a>
                  <div class="product__stats">
                      <span class="product__stats-visitors">🔥أكثر من 2500 زبون راض عن هذا المنتج🔥</span>
                      <span class="product__stats-counter">👁‍🗨 يشاهده <span class="product__stats-number">48</span> زبون في الوقت
                          الحالي.</span>
                  </div>
              </div>`;

    ProductPageDom.innerHTML = Prod;
    
    // Add event listeners for thumbnail images
    document.querySelectorAll('.product__gallery-thumb').forEach(img => {
      img.addEventListener('click', function() {
        document.querySelector('.product__gallery-image').src = this.src;
      });
    });
    
    // Update fake visitor counter randomly
    setInterval(() => {
      const visitorCounter = document.querySelector('.product__stats-number');
      if (visitorCounter) {
        const randomVisitors = Math.floor(Math.random() * 30) + 30;
        visitorCounter.textContent = randomVisitors;
      }
    }, 8000);
  }
};

// Also check for second products
window.addEventListener("secondProductsLoaded", SecondProductPageUI);
