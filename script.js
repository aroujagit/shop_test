// Product detail modal logic
const cards = document.querySelectorAll('.card');
const modal = document.getElementById('product-modal');
const overlay = modal.querySelector('.modal-overlay');
const closeBtn = modal.querySelector('.close-btn');
const mainImg = modal.querySelector('#main-image');
const thumbImgs = modal.querySelectorAll('.thumb');
const productNameEl = modal.querySelector('.modal-product-name');
const currentPriceEl = modal.querySelector('.current-price');
const originalPriceEl = modal.querySelector('.original-price');
const qtyMinus = modal.querySelector('.qty-btn.minus');
const qtyPlus = modal.querySelector('.qty-btn.plus');
const qtyValue = modal.querySelector('.qty-value');
const subtotalVal = modal.querySelector('#subtotal-val');
const shippingVal = modal.querySelector('#shipping-val');
const totalVal = modal.querySelector('#total-val');
const sizeBtns = modal.querySelectorAll('.size-btn');
const cartBtn = modal.querySelector('.cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartOverlay = cartModal.querySelector('.modal-overlay');
const cartCloseBtn = cartModal.querySelector('.cart-close');
const cartItemsEl = document.getElementById('cart-items');
const cartItemsCountEl = document.getElementById('cart-items-count');
const cartTotalPriceEl = document.getElementById('cart-total-price');
const cartShippingEl = document.getElementById('cart-shipping');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const cartCountEl = document.querySelector('.cart-count');
const SHIPPING_COST = 7; // DT
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
updateCartCount();

function updateCartCount() {
  renderCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalItems;
}

// Handle size button active state
sizeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sizeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

let qty = 1;
let unitPrice = 0;

function openModal(name, price, imgSrc) {
  productNameEl.textContent = name;
  unitPrice = parseFloat(price);
  currentPriceEl.textContent = price + 'DT';
  originalPriceEl.textContent = '';
  mainImg.src = imgSrc;
  thumbImgs.forEach(t => (t.src = imgSrc));
  qty = 1;
  // reset size selection
  sizeBtns.forEach(b => b.classList.remove('active'));
  updateTotals();
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

function updateTotals() {
  qtyValue.textContent = qty;
  const subtotal = unitPrice * qty;
  subtotalVal.textContent = subtotal + 'DT';
  shippingVal.textContent = SHIPPING_COST + 'DT';
  totalVal.textContent = subtotal + SHIPPING_COST + 'DT';
}

cards.forEach(card => {
  card.addEventListener('click', () => {
    const imgSrc = card.querySelector('img').getAttribute('src');
    const name = card.querySelector('.product-name').textContent;
    const priceText = card.querySelector('.price').textContent.replace(/[^0-9.]/g, '');
    openModal(name, priceText, imgSrc);
  });
});

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (!modal.classList.contains('hidden') && e.key === 'Escape') closeModal();
});

qtyPlus.addEventListener('click', () => {
  qty++;
  updateTotals();
});

qtyMinus.addEventListener('click', () => {
  if (qty > 1) {
    qty--;
    updateTotals();
  }
});

// Thumbnail click to change main image
thumbImgs.forEach(t => {
  t.addEventListener('click', () => {
    mainImg.src = t.src;
    thumbImgs.forEach(img => img.classList.remove('active'));
    t.classList.add('active');
  });
});

// Add to cart handler
cartBtn.addEventListener('click', () => {
  const activeSize = modal.querySelector('.size-btn.active');
  if (!activeSize) {
    alert('Please select a size');
    return;
  }
  const item = {
    name: productNameEl.textContent,
    size: activeSize.textContent.trim(),
    qty,
    price: unitPrice,
    img: mainImg.src
  };
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  closeModal();
});

// ---------------- Cart modal interactions ----------------
const cartIcon = document.querySelector('.cart-icon');

function openCart() {
  renderCart();
  cartModal.classList.remove('hidden');
}
function closeCart() {
  cartModal.classList.add('hidden');
}

cartIcon.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.addEventListener('keydown', e => {
  if (!cartModal.classList.contains('hidden') && e.key === 'Escape') closeCart();
});

clearCartBtn.addEventListener('click', () => {
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  closeCart();
});

checkoutBtn.addEventListener('click', () => {
  if (!cart.length) {
    alert('Your cart is empty.');
    return;
  }
  // Here you would send the order to backend or open WhatsApp, etc.
  alert('Order sent!');
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  closeCart();
});

function renderCart() {
  cartItemsEl.innerHTML = '';
  if (!cart.length) {
    cartItemsEl.innerHTML = '<p style="text-align:center">Cart is empty.</p>';
    cartItemsCountEl.textContent = 0;
    cartTotalPriceEl.textContent = '0DT';
    return;
  }
  let totalPrice = 0;
  cart.forEach((item, idx) => {
    totalPrice += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <p>${item.name}</p>
        <p>Size: ${item.size}</p>
        <p>Qty: ${item.qty}</p>
        <p>${item.price * item.qty}DT</p>
      </div>
      <button class="remove-btn" data-index="${idx}">&times;</button>
    `;
    cartItemsEl.appendChild(div);
  });
  cartItemsCountEl.textContent = cart.length;
  cartShippingEl.textContent = SHIPPING_COST + 'DT';
  cartTotalPriceEl.textContent = (totalPrice + SHIPPING_COST) + 'DT';

  // remove handlers
  cartItemsEl.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
    });
  });
}