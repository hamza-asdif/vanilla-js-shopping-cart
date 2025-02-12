
let CartContainer = document.querySelector(".cart")
let favoriteContainer = document.querySelector(".favorites-container")

// !!!! functions to DRAW FAVORITES PRODUCT IN WIDGET - HOME PAGE ------------
const DrawFavoritesProduct = function(id) {
    
     if (window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("search.html")){
        Products.forEach(item => {
            if ( item.id == id) {
                let CurrentProduct = `<div class="cart-table-data favorite-parent" id="favorites-product-${item.id}">
                                <div class="cart-data-img-box">
                                    <img src="${item.Image}" alt="" onclick=" driveProducts(${item.id}) ">
                                </div>
                                <div class="cart-data-product-title">
                                    <a href="#" class="cart-data-title-link"> <h4 class="cart-data-title" onclick=" driveProducts(${item.id}) " > ${item.name} </h4></a>
                                </div>
        
                                
        
                                <div class="cart-data-price">
                                    <span class="product-price" onclick=" driveProducts(${item.id})"> ${item.price} ريال سعودي </span>
                                </div>
        
                                <div class="cart-data-trash">
                                    <i class="fa-regular fa-trash-can" id="trash-${item.id}" ></i>
                                </div>
                            </div>`
    
                favoriteWidget.innerHTML += CurrentProduct
                // --- set the favorites data into local storage 
                FavoritesProductsToStorage(item)
                
            }
    
        
        });
     }

    // --- selecte the favorite button that clicked on
    let Products_Fav_Link = document.querySelector(`#favorite-a${id}`)
    let FavoriteIcon = document.querySelector(`#favorite-${id}`)
    let AddedTofavIcon = document.querySelector(`.active-icon-${id}`)
    CartContainer.style.scale = "1"
    Overlay.style.display = "block"
    favoriteContainer.style.display = "block"
    

    DisabelFavButton(Products_Fav_Link)
    trashFavorite()
}


// !!! --------- functions to Disable The Favorite Button -------------
const DisabelFavButton = function(fav_link) {

    fav_link.style.cursor = "no-drop"
    fav_link.innerHTML = `تمت اضافته الى السلة
                              <i class="fa-regular fa-heart favorite" style="display:none"></i>
                              <i class="fa-solid fa-heart favorite active-icon"></i>`
}




// !!! --------- functions to set Favorites Products In LocalStorage -------------
let FavoritesInStorage = JSON.parse(localStorage.getItem("Favorites_Products")) || []
const FavoritesProductsToStorage = function(product) {
    FavoritesInStorage.push(product)
    localStorage.setItem("Favorites_Products", JSON.stringify(FavoritesInStorage))
}





// !!! --------- functions to draw Favorites Products from LocalStorage -------------
const DrawFavroites_FromStorage = function(){
    if (FavoritesInStorage.length != 0) {
        FavoritesInStorage.forEach( function(item){
            let Fav_Storage = `<div class="cart-table-data favorite-parent" id="favorites-product-${item.id}">
                                <div class="cart-data-img-box">
                                    <img src="${item.Image}" alt="" onclick=" driveProducts(${item.id}) ">
                                </div>
                                <div class="cart-data-product-title">
                                    <a href="#" class="cart-data-title-link"> <h4 class="cart-data-title" onclick=" driveProducts(${item.id}) " > ${item.name} </h4></a>
                                </div>
        
        
                                <div class="cart-data-price">
                                    <span class="product-price" onclick=" driveProducts(${item.id}) "> ${item.price} ريال سعودي </span>
                                </div>
                                   
                                <div class="cart-data-trash">
                                    
                                    <i class="fa-regular fa-trash-can" id="trash-${item.id}" ></i>
                                </div>
                            </div>`
            

                            // <i class="fa-regular fa-trash-can" onclick="trashIcon(${item.id}, minus_addToCart_cart(${item.id}) )"></i>

            favoriteWidget.innerHTML += Fav_Storage
            let FavLink_FromStorage = document.querySelector(`#favorite-a${item.id}`)

            if ( window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("search.html")){
                DisabelFavButton(FavLink_FromStorage)
            }
        })
    }
}
DrawFavroites_FromStorage()




// !!! --------- functions to check if the favorite product is not dublicated -------------
const favoritesHomePage_Popup = function(id) {
    // --- selecte the spesific favorite product
    let Added_to_Favorites = document.querySelector(`#favorites-product-${id}`)


    // --- check the product not in favorite DOM
    if (!Added_to_Favorites) {
        DrawFavoritesProduct(id)
    }

    // --- functions to hide the overlay and the favorites widget
    Overlay.addEventListener("click", function() {
        
        Overlay.style.display = "none"
        CartContainer.style.scale = "0"
        favoriteContainer.style.display = "none"
    })
    
}



function ForFavotitePage() {
    if (window.location.pathname.endsWith("favorites.html")){
        CartContainer.style.scale = "1"
        favoriteContainer.removeAttribute("class")
        favoriteContainer.setAttribute("class", "new-favorite-page")
    }
}
ForFavotitePage()




const trashFavorite = function() {

    FavoritesInStorage.forEach(function(element) {
        let button = document.querySelector(`#trash-${element.id}`)
        let FavoriteDomChild = document.querySelector(`#favorites-product-${element.id}`)

        // -- add click event to the cliked dynamic button
        button.addEventListener("click", function() {
            if ( button.id.split("-")[1] == element.id){
                // --- set a new array without the removed item
                FavoritesInStorage = FavoritesInStorage.filter( function(item) {
                    return item.id != element.id
                })
                
                

                // --- set this new array into local storage to keep data dynamic + remove the element from DOM
                localStorage.setItem("Favorites_Products", JSON.stringify(FavoritesInStorage))
                favoriteWidget.removeChild(FavoriteDomChild)

                // --- select the main add to favorites button on home page and delete it style
                if ( window.location.pathname.endsWith("index.html")|| window.location.pathname.endsWith("search.html")){
                    let FavLink = document.querySelector(`#favorite-a${element.id}`) || ""
                    if ( FavLink.getAttribute("style")){
                        FavLink.removeAttribute("style")
                    }
                    FavLink.innerHTML = `أضف إلى المفضلة
                              <i class="fa-regular fa-heart favorite"></i>
                              <i class="fa-solid fa-heart favorite active-icon" style="display: none;"></i>`
                }
            }
        })
    })
}

if ( window.location.pathname.endsWith("favorites.html") || window.location.pathname.endsWith("index.html")){
    trashFavorite()
}

