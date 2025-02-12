let HomePageDom = document.querySelector(".product-data-section");
// ------- import products from local storage




// !!!!! function to import new DB PRODUCTS if the user changes products data
const NewDB = function(){
  if ( localStorage.getItem("NewProducts")){
    Products = JSON.parse(localStorage.getItem("NewProducts"))
  }

  else{
    Products = JSON.parse(localStorage.getItem("Products"));
  }
}
NewDB()



// !!!! functions to draw products into home page
const DrawHomePageProducts = function () {
  if ( window.location.pathname.endsWith("index.html")){
    Products.map(function (product) {
      let productDom = `<div class="product-container">
                      <a href="#" class="product-a">
                          <div class="product-img-box">
                              <img src= ${product.Image} alt="" class="product-img" onclick="CreateProductPageId(${product.id})">
                          </div>
                      </a>
  
                      <div class="product-infos-box">
                          <a href="#" class="product-title-link">
                             <h3 class="product-title"> ${product.name} </h3>
                          </a>
                          <span class="product-old-price">279 ريال سعودي</span>
                          <span class="product-price"> ${product.price} ريال سعودي</span>
                          <button class="product-btn" id="buynow" onclick= "DontDublicate(${product.id})">للطلب اضغطي هنا</button>
                          <span href="#" class="favorite-a"  id="favorite-a${product.id}" onclick="favoritesHomePage_Popup(${product.id})" > أضف إلى المفضلة
                              <i class="fa-regular fa-heart favorite" id="favorite-${product.id}"></i>
                              <i class="fa-solid fa-heart favorite active-icon-${product.id}" style="display: none;"></i>
                          </span>
                      </div>
                  </div>`;
  
      HomePageDom.innerHTML += productDom;
    });
  }
};
DrawHomePageProducts();

// !!!! functions to add product widget into the sidebar
let CartWidget;
const ProductCartWidget = function (id) {
  Products.forEach((element) => {
    if (element.id == id) {
      CartWidget = `<div id="sidebar-product-container-${element.id}">
        <li id="product-${element.id}">
            <div class="cart-product-box">
                <img src=${element.Image} alt="">
            </div>

            <a href="#">
                <span class="cart-product-title" onclick="CreateProductPageId(${element.id})">
                    ${element.name}
                </span>
            </a>

            <div class="cart-product-icons">
                <button type="button">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button type="button">
                    <i class="fa-regular fa-trash-can" id="trash-product" onclick="TrashFromCart_HomePage(${element.id})"></i>
                </button>
            </div>
        </li>
        <div class="cart-product-infos" id="product-div-${element.id}" >
            <span class="cart-product-infos-title">الكمية</span>
            <span class="cart-product-quantite" id="quantity-${element.id}"> ${element.quantity} </span>
            <span class="cart-product-price"> ${element.price} ريال سعودي</span>
        </div>
     </div>`;

      SidebarUlDiv.innerHTML += CartWidget;
      
    }
  });

  OpenCloseSideBar();
  CartCounter()
};



// !!!! function to make sure not dublicating items
const DontDublicate = function (id) {
  let Product_Li = document.querySelector(`#product-${id}`) || null
  let Product_div = document.querySelector(`#product-div-${id}`) || null
  let productCartContainer = document.querySelector(`#sidebar-product-container-${id}`)
  
  if (!productCartContainer) {
    NewDB()
    ProductCartWidget(id);
  } else {
    console.log(Products)

    Products.forEach(function (product) {
      if (product.id == id) {
        product.quantity += 1;
        let quantityElement = productCartContainer.querySelector(".cart-product-quantite") || null
        quantityElement.innerHTML = product.quantity; // 
      }
    });
  }

  SaveInStorage(); // 
  OpenCloseSideBar();
  sidebarCartSum(id)
};




const SaveInStorage = function() {
  let newProducts = []; 
  let ulNode = document.querySelectorAll(".ul-product-dom li"); 
  let ul = [...ulNode]; 

  ul.forEach(function(li) {
    let productId = li.id.split("-");
    Products.forEach(function(item) {
      if (item.id == productId[1]) {
        newProducts.push(item); 
      }
    });
  });


  let NewDBProducts = Products

  console.log(NewDBProducts) 

  // save into localStorage
  localStorage.setItem("Cart_Products", JSON.stringify(newProducts));
  localStorage.setItem("NewProducts", JSON.stringify(NewDBProducts))
};




const CartProductsStorage = function() {
  let CartProducts = JSON.parse(localStorage.getItem("Cart_Products")) || [];
  let CartTotalPrice = localStorage.getItem("TotalPrice") || "";
  let CartCounterStorage = localStorage.getItem("Cart_Counter") || "";
  let sidebarCounter = localStorage.getItem("Cart_Counter") || "";

  if (CartProducts.length > 0) {
    CartProducts.forEach(function(element) {
      let Product_Cart = `<div id="sidebar-product-container-${element.id}">
        <li id="product-${element.id}">
            <div class="cart-product-box">
                <img src=${element.Image} alt="">
            </div>

            <a href="#">
                <span class="cart-product-title" onclick="CreateProductPageId(${element.id})">
                    ${element.name}
                </span>
            </a>

            <div class="cart-product-icons">
                <button type="button">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button type="button">
                    <i class="fa-regular fa-trash-can" id="trash-product" onclick="TrashFromCart_HomePage(${element.id})"></i>
                </button>
            </div>
        </li>
        <div class="cart-product-infos" id="product-div-${element.id}" >
            <span class="cart-product-infos-title">الكمية</span>
            <span class="cart-product-quantite" id="quantity-${element.id}"> ${element.quantity} </span>
            <span class="cart-product-price"> ${element.price} ريال سعودي</span>
        </div>
     </div>`;
      
      SidebarUlDiv.innerHTML += Product_Cart; // append into sidebar
    });

    sidebarCartSumDom.innerHTML = CartTotalPrice;
    HeaderCartSumDom.innerHTML = CartTotalPrice;
    sidebarCartCounter.innerHTML = `${sidebarCounter} عناصر`;

    if (CartCounterStorage) {
      HeaderCartCounter.style.display = "block";
      HeaderCartCounter.innerHTML = CartCounterStorage;
    }
  }
};
// draw from local storage when page loaded
document.addEventListener("DOMContentLoaded", function() {
  CartProductsStorage();
});



let TotalPrice = parseFloat(localStorage.getItem("TotalPrice")) || 0
// !!!! functions to show the SUM of products in cart into SIDEBAR
const sidebarCartSum = function(id) {
  Products.forEach( function(product) {
    if ( product.id == id) {
      TotalPrice += product.price
    }
  })

  sidebarCartSumDom.innerHTML = `${TotalPrice} ريال سعودي`
  HeaderCartSumDom.innerHTML = `${TotalPrice} ريال سعودي`
  localStorage.setItem("TotalPrice", `${TotalPrice} ريال سعودي`)
}

// --- descrease function
// !!!! functions to show the SUM of products in cart into SIDEBAR
const sidebarCartSum_Decrease = function(id) {
  Products.forEach( function(product) {
    if ( product.id == id) {
        TotalPrice -= product.price
        console.log(TotalPrice)
    }
  })
  sidebarCartSumDom.innerHTML = `${TotalPrice} ريال سعودي`
  HeaderCartSumDom.innerHTML = `${TotalPrice} ريال سعودي`
  localStorage.setItem("TotalPrice", `${TotalPrice} ريال سعودي`)
}


// !!!! functions to show the Counter in The SIDEBAR & Header Span
function CartCounter() {
  let SidebarProducts = document.querySelectorAll(".ul-product-dom li");
  SidebarProducts = Array.from(SidebarProducts);

  HeaderCartCounter.style.display = "block";
  HeaderCartCounter.innerHTML = SidebarProducts.length;

  sidebarCartCounter.innerHTML = `${SidebarProducts.length} عناصر`;

  localStorage.setItem("Cart_Counter", SidebarProducts.length);

}

// !!!! functions to get product to move into PRDUCTS PAGE
const CreateProductPageId = function(id){
  Products.forEach( function(item) {
    if ( item.id == id) {
      localStorage.setItem("Product_Id", item.id)

      window.location = "product-page.html"
    }
  })
}
CreateProductPageId()




// !!!! functions to get product to move into PRDUCTS PAGE
const CreateSecondProductPageId = function(id){
  My_Second_Products.forEach( function(item) {
    if ( item.id == id) {
      localStorage.setItem("Second_Product_Id", item.id)

      window.location = "product-page.html"
    }
  })
}
CreateSecondProductPageId()







// !!!!!! --------- functions to DRAW THE SEDOND PRODUCTS WIDGETS ON HOME PAGE
const drawSecondProduct = function() {
  let Get_secondProducts = JSON.parse(localStorage.getItem("Second_Products"))
  let secondProductDom = document.querySelector(".main-second-product")
  let SecondProductsHtml = ""
  Get_secondProducts.forEach(function(product) {
    SecondProductsHtml += `<div class="product-box">
                    <a href="#" class="second-product-link">
                        <div class="second-product-img-box">
                            <img src=${product.Image} alt="" onclick="CreateSecondProductPageId(${product.id})">
                        </div>
                
                        <div class="second-product-product">
                            <h2 class="second-product-product-title"> ${product.name} </h2>
                            <div class="second-product-prices">
                                <span class="second-product-old-price">249 ريال سعودي</span>
                                <span class="second-product-price">${product.price}  ريال سعودي</span>
                            </div>
                        </div>
                    </a>
                </div>`
  })

  secondProductDom.innerHTML = SecondProductsHtml
}

if ( window.location.pathname.endsWith("index.html")){
  drawSecondProduct()
}


const storedProducts = JSON.parse(localStorage.getItem("Products"));
console.log(storedProducts); // تحقق من وجود المنتجات
