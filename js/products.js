const products = [
  {
    id: 1,
    name: "Product 1",
    price: 99.99,
    image: "img/product1.jpg",
    description: "Product 1 description",
  },
  // Add more products as needed
];

// Initialize products on page load
window.addEventListener("DOMContentLoaded", function () {
  // Get products from localStorage or use default products
  let storedProducts = localStorage.getItem("Products");

  if (!storedProducts) {
    // If no products in localStorage, use MyProducts from mydata.js
    localStorage.setItem("Products", JSON.stringify(MyProducts));
    storedProducts = MyProducts;
  } else {
    storedProducts = JSON.parse(storedProducts);
  }

  // Make Products globally available
  window.Products = storedProducts;

  // Trigger products loaded event
  window.dispatchEvent(new Event("productsLoaded"));
});

function displayProducts() {
  const productsContainer = document.querySelector(".products-container");
  if (!productsContainer) return;

  products.forEach((product) => {
    const productElement = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    productsContainer.innerHTML += productElement;
  });
}

// Call this when the page loads
document.addEventListener("DOMContentLoaded", displayProducts);
