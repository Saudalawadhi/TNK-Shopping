/***************************************
 * 1. Contact Form Submission Alert
 ***************************************/
document.addEventListener("DOMContentLoaded", () => {
    // CONTACT FORM
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Message Sent!");
      });
    }
  
    // CATEGORY BUTTONS (SHOP PAGE)
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const category = this.dataset.category; // e.g. "mens", "womens", etc.
        showProducts(category);
      });
    });
  
    // UPDATE CART COUNT EVERY LOAD
    updateCartCount();
  
    // DISPLAY CART ITEMS IF ON cart.html
    displayCart();
  
    // LOAD PRODUCT DETAILS IF ON product.html
    loadProductDetails();
  
    // CHECKOUT BUTTON (CART PAGE)
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", checkout);
    }
  
    // CHECKOUT FORM SUBMIT (CHECKOUT PAGE)
    handleCheckoutPage();
  });
  
  /***************************************
   * 2. Product Data
   ***************************************/
  const products = {
    mens: [
      {
        id: 1,
        name: "Men's T-Shirt",
        price: 25,
        image: "mens1.jpg",
        description: "A comfortable cotton t-shirt for everyday wear."
      },
      {
        id: 2,
        name: "Men's Jeans",
        price: 40,
        image: "mens2.jpg",
        description: "Classic denim jeans with a modern fit."
      },
      {
        id: 3,
        name: "Men's Jacket",
        price: 60,
        image: "mens3.jpg",
        description: "Stylish jacket for chilly weather."
      }
    ],
    womens: [
      {
        id: 4,
        name: "Women's Dress",
        price: 35,
        image: "womens1.jpg",
        description: "An elegant dress perfect for special occasions."
      },
      {
        id: 5,
        name: "Women's Handbag",
        price: 50,
        image: "womens2.jpg",
        description: "A spacious handbag with multiple compartments."
      },
      {
        id: 6,
        name: "Women's Shoes",
        price: 45,
        image: "womens3.jpg",
        description: "Comfortable yet stylish shoes for everyday wear."
      }
    ],
    kids: [
      {
        id: 7,
        name: "Kids' T-Shirt",
        price: 15,
        image: "kids1.jpg",
        description: "Fun and colorful t-shirt kids will love."
      },
      {
        id: 8,
        name: "Kids' Shorts",
        price: 20,
        image: "kids2.jpg",
        description: "Lightweight shorts for active play."
      },
      {
        id: 9,
        name: "Kids' Sneakers",
        price: 30,
        image: "kids3.jpg",
        description: "Durable sneakers for everyday adventures."
      }
    ],
    home: [
      {
        id: 10,
        name: "Vacuum Cleaner",
        price: 80,
        image: "home1.jpg",
        description: "High-suction vacuum cleaner with multiple attachments."
      },
      {
        id: 11,
        name: "Blender",
        price: 50,
        image: "home2.jpg",
        description: "Versatile blender perfect for smoothies and sauces."
      },
      {
        id: 12,
        name: "Microwave",
        price: 100,
        image: "home3.jpg",
        description: "Compact microwave with easy-to-use controls."
      }
    ],
    gadgets: [
      {
        id: 13,
        name: "Smartwatch",
        price: 120,
        image: "gadgets1.jpg",
        description: "Stay connected with this sleek fitness-tracking watch."
      },
      {
        id: 14,
        name: "Wireless Earbuds",
        price: 80,
        image: "gadgets2.jpg",
        description: "Noise-cancelling earbuds with excellent sound quality."
      },
      {
        id: 15,
        name: "Portable Speaker",
        price: 70,
        image: "gadgets3.jpg",
        description: "Bluetooth speaker with powerful audio and long battery life."
      }
    ]
  };
  
  /***************************************
   * 3. Show Products (Shop Page)
   ***************************************/
  function showProducts(category) {
    const productsSection = document.getElementById("products-section");
    if (!productsSection) return; // Not on shop page
  
    // Clear previous products
    productsSection.innerHTML = "";
  
    // Retrieve products for the chosen category
    const selectedProducts = products[category] || [];
    console.log("Loaded category:", category, selectedProducts); // Debug
  
    // Generate product cards
    selectedProducts.forEach((product) => {
      const productCard = `
        <div class="product-card">
          <img src="images/${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>Price: $${product.price}</p>
          <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
            Add to Cart
          </button>
          <button onclick="viewProduct(${product.id})">
            View Details
          </button>
        </div>
      `;
      productsSection.innerHTML += productCard;
    });
  }
  
  /***************************************
   * 4. Cart Functionality
   ***************************************/
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Add to cart
  function addToCart(id, name, price, image) {
    console.log("Adding to cart:", id, name, price); // Debug
    const existingItem = cart.find((item) => item.id === id);
  
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart!`);
  }
  
  // Update cart count (navbar)
  function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return; // Not on a page with cart-count
  
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;
    console.log("Updated cart count:", totalQuantity);
  }
  
  // Display cart items (cart.html)
  function displayCart() {
    const cartSection = document.getElementById("cart-items");
    const checkoutButton = document.getElementById("checkout-btn");
    const cartTotalElement = document.getElementById("cart-total");
    
    // If we are NOT on cart.html, do nothing
    if (!cartSection || !checkoutButton || !cartTotalElement) return;
  
    cartSection.innerHTML = "";
  
    if (cart.length === 0) {
      cartSection.innerHTML = "<p>Your cart is empty.</p>";
      checkoutButton.style.display = "none";
      return;
    }
  
    cart.forEach((item) => {
      const cartItem = `
        <div class="cart-item">
          <img src="images/${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>Price: $${item.price}</p>
          <p>
            Quantity:
            <button onclick="changeQuantity(${item.id}, -1)">-</button>
            ${item.quantity}
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
          </p>
          <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `;
      cartSection.innerHTML += cartItem;
    });
  
    updateCartTotal();
    checkoutButton.style.display = "block";
  }
  
  // Change quantity in cart
  function changeQuantity(id, amount) {
    const item = cart.find((product) => product.id === id);
    if (!item) return;
  
    item.quantity += amount;
    if (item.quantity <= 0) {
      // Remove item if quantity goes to zero
      cart = cart.filter((product) => product.id !== id);
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
  }
  
  // Remove item from cart
  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
  }
  
  // Update cart total with shipping
  function updateCartTotal() {
    const cartTotal = document.getElementById("cart-total");
    if (!cartTotal) return;
  
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + 10; // shipping = $10
    cartTotal.textContent = `Total: $${total} (Shipping: $10)`;
  }
  
  // Checkout from the cart page
  function checkout() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + 10;
    // Save total so we can show it on checkout.html
    localStorage.setItem("cartTotal", JSON.stringify(total));
    
    window.location.href = "checkout.html";
  }
  
  /***************************************
   * 5. Product Details (product.html)
   ***************************************/
  // Save product info and navigate
  function viewProduct(id) {
    const allProducts = Object.values(products).flat(); // flatten all categories
    const found = allProducts.find((p) => p.id === id);
    localStorage.setItem("selectedProduct", JSON.stringify(found));
    window.location.href = "product.html";
  }
  
  // Load product details on product.html
  function loadProductDetails() {
    const productDetailsSection = document.getElementById("product-details");
    if (!productDetailsSection) return; // Not on product page
  
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!product) {
      productDetailsSection.innerHTML = "<p>Product not found.</p>";
      return;
    }
  
    productDetailsSection.innerHTML = `
      <img src="images/${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>Price: $${product.price}</p>
      <p>${product.description}</p> <!-- Brief info displayed here -->
      <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
        Add to Cart
      </button>
    `;
  }
  
  /***************************************
   * 6. Checkout (checkout.html)
   ***************************************/
  function handleCheckoutPage() {
    const checkoutForm = document.getElementById("checkout-form");
    if (!checkoutForm) return; // Not on checkout page
  
    // Show the order summary
    const checkoutSubtotal = document.getElementById("checkout-subtotal");
    const checkoutTotal = document.getElementById("checkout-total");
    const storedTotal = JSON.parse(localStorage.getItem("cartTotal")) || 10; // fallback
  
    // Subtotal is total minus shipping
    const sub = storedTotal - 10;
    if (checkoutSubtotal) {
      checkoutSubtotal.textContent = `$${sub < 0 ? 0 : sub}`;
    }
    if (checkoutTotal) {
      checkoutTotal.textContent = `$${storedTotal}`;
    }
  
    // On checkout form submit => place order
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();
      placeOrder();
    });
  }
  
  function placeOrder() {
    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    localStorage.removeItem("cartTotal");
    window.location.href = "index.html";
  }
  