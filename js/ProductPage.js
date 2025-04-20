// !!! functions to draw Products From Cart into Product Page

const ProductPageUI = function (id) {
  let ProductId_Storage = localStorage.getItem("Product_Id") || "";
  const products = JSON.parse(localStorage.getItem("Products")) || [];

  products.forEach(function (element) {
    if (element.id == ProductId_Storage) {
      let Prod = `<div class="product-image-container">
                    <div class="product-img-box">
                        <img src="${element.Image}" alt="">
                    </div>

                    <div class="product-image-alternative">
                        <img src="${element.Image}" alt="" class="image-alternative">
                        <img src="${element.Image}" alt="" class="image-alternative">
                        <img src="${element.Image}" alt="" class="image-alternative">
                        <img src="${element.Image}" alt="" class="image-alternative">
                    </div>
                </div>

                <div class="product-ui-infos">
                    <h2 class="product-ui-title">${element.name}</h2>
                    <div class="product-ui-prices">
                        <span class="product-ui-price"> ${element.price} ريال سعودي  </span>
                        <span class="price-off"> ${element.price} ريال سعودي  </span>
                    </div>

                    <span class="product-checkout-title">للطلب يرجى إدخال معلوماتك في الخانات أسفله</span>
                    <form action="">
                        <div class="checkout-inputs">
                           <input type="text" class="full-name" placeholder="الاسم بالكامل">
                           <input type="text" class="phone" placeholder="رقم الهاتف">
                           <input type="text" class="city" placeholder="المدينة">
                           <input type="text" class="adress" placeholder="العنوان">
                        </div>
                    </form>

                    <a class="checkout-btn-container">
                        <form action="">
                        <i class="fa-solid fa-cart-plus"></i>
                        <input type="submit" class="checkout-btn" value="لتأكيد الطلب اضغط هنا">
                        </form>
                    </a>
                    <div class="fake-infos">
                        <span class="fake-visitors">🔥أكثر من 2500 زبون راض عن هذا المنتج🔥</span>
                        <span class="fake-counter">👁‍🗨 يشاهده <span class="visitors-counter">48</span> زبون في الوقت
                            الحالي.</span>
                    </div>
                </div>`;

      ProductPageDom.innerHTML = Prod;
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
      let Prod = `<div class="product-image-container">
                    <div class="product-img-box">
                        <img src="${element.Image}" alt="">
                    </div>

                    <div class="product-image-alternative">
                        <img src="${element.Image}" alt="" class="image-alternative">
                        <img src="${element.Image}" alt="" class="image-alternative">
                        <img src="${element.Image}" alt="" class="image-alternative">
                        <img src="${element.Image}" alt="" class="image-alternative">
                    </div>
                </div>

                <div class="product-ui-infos">
                    <h2 class="product-ui-title">${element.name}</h2>
                    <div class="product-ui-prices">
                        <span class="product-ui-price"> ${element.price} ريال سعودي  </span>
                        <span class="price-off"> ${element.price} ريال سعودي  </span>
                    </div>

                    <span class="product-checkout-title">للطلب يرجى إدخال معلوماتك في الخانات أسفله</span>
                    <form action="">
                        <div class="checkout-inputs">
                           <input type="text" class="full-name" placeholder="الاسم بالكامل">
                           <input type="text" class="phone" placeholder="رقم الهاتف">
                           <input type="text" class="city" placeholder="المدينة">
                           <input type="text" class="adress" placeholder="العنوان">
                        </div>
                    </form>

                    <a class="checkout-btn-container">
                        <form action="">
                        <i class="fa-solid fa-cart-plus"></i>
                        <input type="submit" class="checkout-btn" value="لتأكيد الطلب اضغط هنا">
                        </form>
                    </a>
                    <div class="fake-infos">
                        <span class="fake-visitors">🔥أكثر من 2500 زبون راض عن هذا المنتج🔥</span>
                        <span class="fake-counter">👁‍🗨 يشاهده <span class="visitors-counter">48</span> زبون في الوقت
                            الحالي.</span>
                    </div>
                </div>`;

      ProductPageDom.innerHTML = Prod;
    }
  });
};

// Wait for products to be loaded
window.addEventListener("productsLoaded", SecondProductPageUI);

// Also run on page load in case products are already loaded
document.addEventListener("DOMContentLoaded", SecondProductPageUI);
