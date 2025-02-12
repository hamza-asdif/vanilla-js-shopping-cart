

const CartPageDraw = function() {
    if (window.location.pathname.endsWith("cart.html")){
        let CartProducts = JSON.parse(localStorage.getItem("Cart_Products")) || [];
    let cartHTML = "";
    CartProducts.forEach(item => {
        cartHTML += `<div class="cart-table-data" id="product-${item.id}">
                            <div class="cart-data-img-box">
                                <img src="${item.Image}" alt="" onclick=" driveProducts(${item.id}) ">
                            </div>
                            <div class="cart-data-product-title">
                                <a href="#" class="cart-data-title-link"> <h4 class="cart-data-title" onclick=" driveProducts(${item.id}) " > ${item.name} </h4></a>
                            </div>
    
                            <div class="cart-data-quantity">
                                <i class="fa-solid fa-plus"  onclick="IncreaseQuantity(${item.id})"></i>
                                <span class="quantity-span-${item.id}">${item.quantity}</span>
                                <i class="fa-solid fa-minus" onclick="decreaseQuantity(${item.id})"></i>
                            </div>
    
                            <div class="cart-data-price">
                                <span class="product-price" onclick=" driveProducts(${item.id}) "> ${item.price} ريال سعودي </span>
                            </div>
    
                            <div class="cart-data-trash">
                                <i class="fa-regular fa-trash-can" onclick="TrashFromCart_CartPage(${item.id})"></i>
                            </div>
                        </div>`;
    });
    CartPageDom.innerHTML = cartHTML;
    }
}
CartPageDraw()





// !!!!! functions to move into product page when user click on item
const driveProducts = function(id) {
    localStorage.setItem("Product_Id", id)

    setTimeout( function() {
        window.location = "product-page.html"
    }, 1000)
}



// !!!! function to increase | decrease the product quantity on Cart Page 
const IncreaseQuantity = function(id) {
    let ProductsInCart = JSON.parse(localStorage.getItem("Cart_Products"))

    ProductsInCart.forEach( function(product) {
        if ( product.id == id){
            let QauntityDom = document.querySelector(`.quantity-span-${id}`)
            product.quantity += 1
            QauntityDom.innerHTML = product.quantity
            localStorage.setItem("Cart_Products", JSON.stringify(ProductsInCart))
            sidebarCartSum(id)
            changeSidebarQuantity(id, product)
            UpdateMainProducts(id, 'increase');
        }
    })
}



// -- decrease function
const decreaseQuantity = function(id) {
    let ProductsInCart = JSON.parse(localStorage.getItem("Cart_Products"))

    ProductsInCart.forEach( function(product) {
        if (product.id == id) {
            let QauntityDom = document.querySelector(`.quantity-span-${id}`)
            if ( product.quantity > 1) {
                product.quantity -= 1
                QauntityDom.innerHTML = product.quantity
                localStorage.setItem("Cart_Products", JSON.stringify(ProductsInCart))
                sidebarCartSum_Decrease(id)
                changeSidebarQuantity(id, product)
                UpdateMainProducts(id, 'decrease');
            }
        }
    })
}



const UpdateMainProducts = function(id, operation) {
    let oldProducts = JSON.parse(localStorage.getItem("NewProducts"));
    oldProducts.forEach(product => {
        if (product.id === id) {
            product.quantity += (operation === 'increase' ? 1 : -1);
        }
    });
    localStorage.setItem("NewProducts", JSON.stringify(oldProducts));
}





const changeSidebarQuantity = function(id, product) {
    let quantityElement = document.querySelector(`#quantity-${id}`)
    quantityElement.innerHTML = product.quantity
}



// !!!! function to reset quantity of product if it deleted from cart
const resetQuantity = function(id) {
    // get from localstorage
    let NewDBProducts = JSON.parse(localStorage.getItem("NewProducts")) || [];
    
    // find product with the id 
    NewDBProducts = NewDBProducts.map(product => {
        if (product.id == id) {
            product.quantity = 1; 
            console.log("الكمية تم إعادة تعيينها للمنتج:", product);
        }
        return product;
    });

    // set data into storage
    localStorage.setItem("NewProducts", JSON.stringify(NewDBProducts));
};


// !!! functions to RESET THE PRICE OF PRODUCT HAS QUANTITY OVER 1
const Trash_ResetPrice = function(id) {
    let NewDBProducts = JSON.parse(localStorage.getItem("NewProducts")) || [];
    // let TotalPrice = parseFloat(localStorage.getItem("TotalPrice")) || 0;

    NewDBProducts.forEach(function(product) {
        if (product.id == id) {
            let CurrentQuantity = product.quantity;
            let ProductPrice = product.price;

            // counte the price
            TotalPrice -= (ProductPrice * CurrentQuantity);

            // totalprice is not equal 0
            if (TotalPrice < 0) {
                TotalPrice = 0;
            }

            sidebarCartSumDom.innerHTML = `${TotalPrice} ريال سعودي`;
            HeaderCartSumDom.innerHTML = `${TotalPrice} ريال سعودي`;
            localStorage.setItem("TotalPrice", `${TotalPrice} ريال سعودي`);
        }
    });
};




// !!! TRASH ICON FUNCTIONS TO DELETE THE PRODUCT FROM CART
const TrashFromCart_HomePage = function(id) {
    let ProductsInCart = JSON.parse(localStorage.getItem("Cart_Products")) || [];
    let Product_Li = document.querySelector(`.ul-product-dom #product-${id}`);
    let Product_div = document.querySelector(`.ul-product-dom #product-div-${id}`);
    let productCartContainer = document.querySelector(`#sidebar-product-container-${id}`)

    let NewProductCart = ProductsInCart.filter(product => product.id !== id);

    localStorage.setItem("Cart_Products", JSON.stringify(NewProductCart));

    
    Trash_ResetPrice(id);
    resetQuantity(id); 


    SidebarUlDiv.removeChild(productCartContainer);
    // SaveInStorage();
    CartCounter();
}



const TrashFromCart_CartPage = function(id) {
    let ProductCartChildDom = document.querySelector(`.cart-table #product-${id}`)
    CartPageDom.removeChild(ProductCartChildDom)
    TrashFromCart_HomePage(id)
}