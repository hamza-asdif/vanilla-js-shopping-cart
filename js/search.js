
// !!! functions to show and hide search bar
const SearchBarOpenClose = function() {
    SearchIcon.addEventListener("click", function() {
        if ( SearchBar.style.display == "none") {
            SearchBar.style.display = "block"
            SearchBar.style.height = "60px"
        }
        else{
            SearchBar.style.display = "none"
            SearchBar.style.height = "0px"
        }
    })
}
SearchBarOpenClose()




// !!! function to seacrch over the products
const SearchForProducts = function() {
    let SearchedProducts
    searchInput.addEventListener("keyup", function(e) {

        
        

        if (searchInput.value != "" && e.keyCode == 13) {
            SearchedProducts = Products.filter( function(product) {
                return product.name.toLowerCase().trim().includes(searchInput.value)
                
           })


           console.log(SearchedProducts)
            localStorage.setItem("Searched_Products", JSON.stringify(SearchedProducts))
            window.location = "search.html"
        }
    })
}
SearchForProducts()



// !!! function to draw empty title if no product searched found
let SearchEmpty
const NoProductFound = function() {
    SearchEmpty = `<h2 class="search-product-empty">{...sorry we don't have any product with the current title...}</h2>`
        searchEmptyDom.innerHTML = SearchEmpty
}



// !!!! functions to draw products into home page

const DrawSearchedProducts = function () {
    let ProductsInSearch = JSON.parse(localStorage.getItem("Searched_Products"))

    if(window.location.pathname.endsWith("search.html")){
        if ( ProductsInSearch.length == 0){
            NoProductFound()
        }
    }

    if ( window.location.pathname.endsWith("search.html")){
      ProductsInSearch.map(function (product) {
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
    
        searchPageDom.innerHTML += productDom;
      });
    }
  };
DrawSearchedProducts()


// !!! emidiatelly function to search automatique if user search in SEARCH PAGE
const SearchPage_Search = function() {
    if ( window.location.pathname.endsWith("search.html")){
        Products.filter( function(product) {
            if ( product.name.toLowerCase().trim().includes(searchInput.value)){
                
                let SearchPageProduct = `<div class="product-container">
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
                        <a href="#" class="favorite-a"> أضف إلى المفضلة
                            <i class="fa-regular fa-heart" id="favorite"></i>
                            <i class="fa-solid fa-heart" style="display: none;"></i>
                        </a>
                    </div>
                </div>`

                searchPageDom.innerHTML += SearchPageProduct
            }
        })
    }
}




searchInput.addEventListener("keyup", function() {
    searchPageDom.innerHTML = ""
    SearchPage_Search()

    if (searchPageDom.innerHTML === ""){
        NoProductFound()
    }
    else{
        SearchEmpty = ""
        searchEmptyDom.innerHTML = SearchEmpty
    }
})

