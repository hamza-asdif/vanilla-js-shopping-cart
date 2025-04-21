// !!! functions to draw Products From Cart into Product Page

const ProductPageUI = function (id) {
  let ProductId_Storage = localStorage.getItem("Product_Id") || "";
  const products = JSON.parse(localStorage.getItem("Products")) || [];

  products.forEach(function (element) {
    if (element.id == ProductId_Storage) {
      let Prod = `<div class="product__gallery">
                    <div class="product__gallery-main">
                        <img src="${element.Image}" alt="${element.name}" class="product__gallery-image">
                    </div>

                    <div class="product__gallery-thumbs">
                        <img src="${element.Image}" alt="${element.name}" class="product__gallery-thumb">
                        <img src="${element.Image}" alt="${element.name}" class="product__gallery-thumb">
                        <img src="${element.Image}" alt="${element.name}" class="product__gallery-thumb">
                        <img src="${element.Image}" alt="${element.name}" class="product__gallery-thumb">
                    </div>
                </div>

                <div class="product__info">
                    <h2 class="product__info-title">${element.name}</h2>
                    <div class="product__info-prices">
                        <span class="product__info-price">${element.price} ريال سعودي</span>
                        <span class="product__info-price--old">${Math.round(element.price * 1.2)} ريال سعودي</span>
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
  });
};

// Wait for products to be loaded
window.addEventListener("productsLoaded", ProductPageUI);

// Also run on page load in case products are already loaded
document.addEventListener("DOMContentLoaded", ProductPageUI);

const SecondProductPageUI = function (id) {
  let secondProductId_Storage = localStorage.getItem("Second_Product_Id") || "";
  const secondProducts =
    JSON.parse(localStorage.getItem("Second_Products")) || [];

  secondProducts.forEach(function (element) {
    if (element.id == secondProductId_Storage) {
      let Prod = `<div class="product__gallery">
                    <div class="product__gallery-main">
                        <img src="${element.Image}" alt="${element.name}" class="product__gallery-image">
                    </div>

                    <div class="product__gallery-thumbs">
                        <img src="${element.Image}" alt="${element.name}" class="product__gallery-thumb">
                        <img src="${element.Image}" alt="${element.name}" class="product__gallery-thumb">
                        <img src="${element.Image}" alt="${element.name}" class="product__gallery-thumb">
                        <img src="${element.Image}" alt="${element.name}" class="product__gallery-thumb">
                    </div>
                </div>

                <div class="product__info">
                    <h2 class="product__info-title">${element.name}</h2>
                    <div class="product__info-prices">
                        <span class="product__info-price">${element.price} ريال سعودي</span>
                        <span class="product__info-price--old">${Math.round(element.price * 1.2)} ريال سعودي</span>
                    </div>
                    <div class="product__features">
                        <div class="product__feature-item">
                            <i class="fas fa-truck"></i>
                            <span>توصيل مجاني لجميع أنحاء المملكة</span>
                        </div>
                        <div class="product__feature-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>ضمان الجودة</span>
                        </div>
                        <div class="product__feature-item">
                            <i class="fas fa-undo"></i>
                            <span>استرجاع مجاني خلال 14 يوم</span>
                        </div>
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
  });
};

// Wait for products to be loaded
window.addEventListener("productsLoaded", SecondProductPageUI);

// Also run on page load in case products are already loaded
document.addEventListener("DOMContentLoaded", SecondProductPageUI);
