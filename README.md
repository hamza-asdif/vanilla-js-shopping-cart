# Shopping Cart by Hamza Asdif

A modern Shopping Cart web application built using **pure (vanilla) JavaScript**, HTML, and CSS. This project demonstrates a fully functional e-commerce cart system with product management, cart and favorites handling, and a clean, responsive UI—all without frameworks or libraries.

---

## Features

- **Product Listing:** Browse a list of products with images, prices, and details.
- **Product Details Page:** View detailed information for each product.
- **Add to Cart:** Add products to the cart, update quantities, and remove items.
- **Favorites:** Mark products as favorites and view them in a dedicated section.
- **Persistent Storage:** Cart and favorites are saved using `localStorage` for a seamless user experience.
- **API Integration:** Uses [JSONBin](https://jsonbin.io/) as a private API for secure product data management.
- **API Security:** The API key and endpoints are kept private in the code to protect your data.
- **Responsive Design:** Works on desktop and mobile devices.
- **No Frameworks:** 100% vanilla JS, HTML, and CSS—no dependencies.

---

## Getting Started

1. **Clone or Download** this repository to your local machine.
2. **Open `index.html`** in your browser to start using the app.

No build steps, npm, or server required!

---

## API Details

- Product and cart data can be managed via JSONBin.
- The API configuration is stored securely in `js/config.js`.
- The API key is private and not exposed to the public.

---

## Project Structure

```
SHOPPING CART by Hamza Asdif/
├── index.html
├── product-page.html
├── favorites.html
├── js/
│   ├── script.js
│   ├── ProductPage.js
│   ├── favorites.js
│   ├── mydata.js
│   ├── generals.js
│   ├── config.js        # Contains private JSONBin API config
│   └── ...
├── css/
│   ├── style.css
│   ├── cart.css
│   └── ...
├── images/
└── README.md
```

---

## How It Works

- **All functionality is handled client-side** with JavaScript.
- **Products** and **second products** are loaded from localStorage or default data.
- **Cart** and **favorites** are managed using localStorage, so the user's selections persist across sessions.
- **UI updates** are done via direct DOM manipulation—no frameworks.

---

## Customization

- To add or edit products, update the product arrays in `js/mydata.js` and `js/script.js`.
- To change styles, edit the CSS files in the `css/` folder.

---

## Credits

Developed by **Hamza Asdif**

---

## License

This project is open source and free to use for learning and personal projects.
