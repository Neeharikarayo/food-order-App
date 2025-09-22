// Cart array
let cart = [];

// Load cart from localStorage on page load
window.onload = function () {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
  updateCart();
  updateButtons(); // make sure buttons reflect cart
};

// Add item to cart
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
    const itemName = this.dataset.item;
    const itemPrice = parseFloat(this.dataset.price);

    // Check if item already exists
    const existing = cart.find(i => i.name === itemName);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }

    saveCart();
    updateCart();
    updateButtons();
  });
});

// Remove item from cart
function removeItem(itemName) {
  cart = cart.filter(item => item.name !== itemName);
  saveCart();
  updateCart();
  updateButtons();
}

// Change quantity
function changeQuantity(itemName, delta) {
  const item = cart.find(i => i.name === itemName);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeItem(itemName);
  } else {
    saveCart();
    updateCart();
    updateButtons();
  }
}

// Update cart UI
function updateCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    li.innerHTML = `
      <span>${item.name} ($${item.price}) x ${item.quantity}</span>
      <div>
        <button class="btn btn-sm btn-secondary me-1" onclick="changeQuantity('${item.name}', -1)">-</button>
        <button class="btn btn-sm btn-secondary me-1" onclick="changeQuantity('${item.name}', 1)">+</button>
        <button class="btn btn-sm btn-danger" onclick="removeItem('${item.name}')">Remove</button>
      </div>
    `;
    cartItems.appendChild(li);

    total += item.price * item.quantity;
  });

  cartTotal.textContent = total.toFixed(2);
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Order Now button
document.getElementById('orderNowBtn').addEventListener('click', function() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("✅ Order placed successfully!\nThank you for ordering from Foodies Hub!");
  cart = [];
  saveCart(); // clear storage too
  updateCart();
  updateButtons();
});

// --- NEW: Update Add buttons state ---
function updateButtons() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    const itemName = button.dataset.item;
    const exists = cart.find(i => i.name === itemName);

    if (exists) {
      button.textContent = "Added";
      button.classList.remove("btn-warning");
      button.classList.add("btn-success");
      button.disabled = true;
    } else {
      button.textContent = "Add";
      button.classList.remove("btn-success");
      button.classList.add("btn-warning");
      button.disabled = false;
    }
  });
}