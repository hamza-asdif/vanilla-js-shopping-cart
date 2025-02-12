// **** variables declarations
let form_ProductName = document.querySelector("#name")
let form_ProductMainPrice = document.querySelector("#main-price")
let form_ProductOffPrice = document.querySelector("#off-price")
let form_productImage = document.querySelector("#upload-image")
let createProductBtn = document.querySelector("#create-product-btn")
let CreateProductForm = document.querySelector(".create-product-form")
let GetProducts = JSON.parse(localStorage.getItem("Products"))

// ------------ !!!! functions heres
const GetName = function() {
    let ProductName = form_ProductName.value.trim()
    console.log(ProductName)
}

const getPrice = function() {
    let productPrice = parseFloat(form_ProductMainPrice.value)
}

const getOffPrice = function() {
    let OffPrice = parseFloat(form_ProductOffPrice.value)
}

const uploadImage = function() {
    let file = this.files[0]
    let ImageName = file.name
    console.log(ImageName); 
    
    let MaxFileSize = 1.5 * 1024 * 1024

    if ( file.type == "image/jpeg" || file.type == "image/png"){
        console.log(file)
    }

    if ( file.size <= MaxFileSize){
        console.log(file.size)
    }
}





// !!!! execute functions here
createProductBtn.addEventListener("click", function(e) {
    e.preventDefault()
})

form_ProductName.addEventListener("change", GetName)
form_ProductMainPrice.addEventListener("change", getPrice)
form_ProductOffPrice.addEventListener("change", getOffPrice)
form_productImage.addEventListener("change", uploadImage)


    CreateProductForm.addEventListener("change", function() {
        let ProductName = form_ProductName.value.trim()
        let ProductPrice = parseFloat(form_ProductMainPrice.value.trim())
        let ProductOffPrice = parseFloat(form_ProductOffPrice.value.trim())
        let ProductImage = form_productImage.value
    
        console.log(ProductImage)
    
        let NewProduct = {
            id : GetProducts.length + 1,
            name : ProductName,
            Image : ProductImage,
            price : ProductPrice,
            off_price : ProductOffPrice
        }
    
        createProductBtn.addEventListener("click", function() {
            let form_inputs = document.querySelectorAll("form input")
            form_inputs = Array.from(form_inputs)
            
            let formState = form_inputs.every( function(inp) {
                return inp.value != ""
            })
    
            if ( formState) {
                let NewProductWithCreated = [...GetProducts, NewProduct]
                localStorage.setItem("Products", JSON.stringify(NewProductWithCreated))
                console.log(NewProductWithCreated)
                console.log(ProductImage, typeof ProductImage)
            }
            else{
                console.log("its empty", formState)
            }
        })
    })