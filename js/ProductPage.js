// !!! Draw product details on product page

const ProductPageDom = document.querySelector(".product-ui");

const ProductPageUI = function () {
  // !!! Get product ID from localStorage
  let ProductId_Storage = localStorage.getItem("Product_Id") || "";

  // !!! Get products list
  const products = window.getProducts ? window.getProducts() : 
                  (JSON.parse(localStorage.getItem("Products")) || []);

  // !!! Find product by ID
  const product = products.find(p => p.id == ProductId_Storage);

  if (product) {
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
      
      // !!! Add event listeners for thumbnail images
      document.querySelectorAll('.product__gallery-thumb').forEach(img => {
        img.addEventListener('click', function() {
          document.querySelector('.product__gallery-image').src = this.src;
        });
      });
      
      // !!! Update fake visitor counter randomly
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

// !!! Initialize product page on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    // Use the same logic as products section: check which ID is set, then load the correct product
    let ProductId_Storage = localStorage.getItem("Product_Id") || "";
    let SecondProductId_Storage = localStorage.getItem("Second_Product_Id") || "";
    if (ProductId_Storage) {
      ProductPageUI();
    } else if (SecondProductId_Storage) {
      SecondProductPageUI();
    } else {
      // Show not found if neither is set
      if (ProductPageDom) {
        ProductPageDom.innerHTML = `<div class="product-not-found">
          <h2>المنتج غير موجود</h2>
          <p>عذراً، لم يتم العثور على المنتج المطلوب</p>
          <a href="index.html" class="back-to-shop">العودة للتسوق</a>
        </div>`;
      }
    }
  }, 100); // Small delay to ensure everything is loaded
});

// !!! Handle second products if needed
const SecondProductPageUI = function () {
  // !!! Get second product ID from localStorage
  let secondProductId_Storage = localStorage.getItem("Second_Product_Id") || "";
  
  // !!! Get second products list
  const secondProducts = window.getSecondProducts ? window.getSecondProducts() :
                        (JSON.parse(localStorage.getItem("Second_Products")) || []);
  
  // !!! Find second product by ID
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
    
    // !!! Add event listeners for thumbnail images
    document.querySelectorAll('.product__gallery-thumb').forEach(img => {
      img.addEventListener('click', function() {
        document.querySelector('.product__gallery-image').src = this.src;
      });
    });
    
    // !!! Update fake visitor counter randomly
    setInterval(() => {
      const visitorCounter = document.querySelector('.product__stats-number');
      if (visitorCounter) {
        const randomVisitors = Math.floor(Math.random() * 30) + 30;
        visitorCounter.textContent = randomVisitors;
      }
    }, 8000);
  }
};

// !!! Handle second products loaded event
window.addEventListener("secondProductsLoaded", SecondProductPageUI);
