let SidebarUlDiv = document.querySelector(".ul-product-dom")
let SideBar = document.querySelector(".cart-sidebar")
let SidebarClose = document.querySelector("#close-sidebar")
let CartHeaderLink = document.querySelector(".cart-link")
let sidebarCartSumDom = document.querySelector("#cart-sum-span")
let HeaderCartSumDom = document.querySelector(".cart-span")
let HeaderCartCounter = document.querySelector(".cart-counter")
let sidebarCartCounter = document.querySelector(".sidebar-header-span")

// --------- Product Page Varaibles ---------------- 
let ProductPageDom = document.querySelector(".product-ui")


// ---------- cart page variables -------------------
let CartPageDom = document.querySelector(".cart-table")

// ----------- search page variables or in home page....--------
let SearchIcon = document.querySelector("#search-a")
let SearchBar = document.querySelector(".search-box")
let searchInput = document.querySelector("#search")
let searchPageDom = document.querySelector("#search-product-dom")
let searchEmptyDom = document.querySelector(".search-empty")


// -------- favorites variavles ( home page & favorites page) ---------
let Overlay = document.querySelector(".overlay")
let favoriteWidget = document.querySelector("#favorte-widget")



// !!!! function to open and close sidebar
const OpenCloseSideBar = function() {
    if (SideBar.style.transform = "translateX(-100%)"){
        SideBar.style.transform = "translateX(0px)"
    }

    else{
        SideBar.style.transform = "translateX(-100%)"
    }

    SidebarClose.addEventListener("click", function() {
        SideBar.style.transform = "translateX(-100%)"
    })
}

CartHeaderLink.addEventListener("click", function() {
    OpenCloseSideBar()
})