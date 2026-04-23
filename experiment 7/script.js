/*
  ============================================================
  Project Title : ShopEase — E-Commerce Website (Experiment 7)
  Author        : [Your Name]
  Date          : April 2026
  File          : script.js
  ============================================================
*/

'use strict';

/* ── 1. PRODUCT DATA ─────────────────────────────────────── */
const PRODUCTS = [
  { id:1, name:'Wireless Headphones', price:2499, desc:'Premium sound with 40-hour battery and noise cancellation.', emoji:'🎧', badge:'hot' },
  { id:2, name:'Smart Watch',         price:3999, desc:'Track fitness, notifications and health from your wrist.',  emoji:'⌚', badge:'new' },
  { id:3, name:'Mechanical Keyboard', price:1799, desc:'Tactile switches, RGB backlight, compact 75% layout.',     emoji:'⌨️', badge:null },
  { id:4, name:'Portable Speaker',    price:1299, desc:'360° sound, waterproof, 20-hour playtime anywhere.',       emoji:'🔊', badge:'sale' },
  { id:5, name:'USB-C Hub (7-in-1)',  price:899,  desc:'HDMI 4K, SD card, 3× USB-A, USB-C PD in one hub.',       emoji:'🔌', badge:null },
  { id:6, name:'Webcam HD 1080p',     price:1599, desc:'Crystal-clear video, built-in mic, plug-and-play.',       emoji:'📷', badge:'new' }
];

/* ── 2. CART STATE ───────────────────────────────────────── */
let cart = [];

/* ── 3. DOM REFERENCES ───────────────────────────────────── */
const productGrid     = document.getElementById('product-grid');
const cartSidebar     = document.getElementById('cart-sidebar');
const cartOverlay     = document.getElementById('cart-overlay');
const cartItemsEl     = document.getElementById('cart-items');
const cartCountEl     = document.getElementById('cart-count');
const cartTotalEl     = document.getElementById('cart-total-price');
const cartSubEl       = document.getElementById('cart-sub-price');
const checkoutBtn     = document.getElementById('checkout-btn');
const cartBtn         = document.getElementById('cart-btn');
const closeCartBtn    = document.getElementById('close-cart');
const checkoutOverlay = document.getElementById('checkout-overlay');
const checkoutForm    = document.getElementById('checkout-form');
const confirmView     = document.getElementById('confirm-view');
const toastEl         = document.getElementById('toast');
const summaryItems    = document.getElementById('summary-items');
const summaryTotal    = document.getElementById('summary-total');

/* ── 4. RENDER PRODUCTS ──────────────────────────────────── */
function renderProducts() {
  productGrid.innerHTML = '';
  PRODUCTS.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;

    const badgeHTML = product.badge
      ? `<span class="badge ${product.badge}">${product.badge.toUpperCase()}</span>`
      : '';

    card.innerHTML = `
      ${badgeHTML}
      <div class="product-img">${product.emoji}</div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-footer">
          <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
          <button class="btn-add" onclick="addToCart(${product.id})">+ Add</button>
        </div>
      </div>`;
    productGrid.appendChild(card);
  });
}

/* ── 5. ADD TO CART ──────────────────────────────────────── */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
    showToast(`🛒 ${product.name} quantity updated`);
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 });
    showToast(`✅ ${product.name} added to cart`);
  }

  // Button feedback
  const btn = document.querySelector(`.product-card[data-id="${productId}"] .btn-add`);
  if (btn) {
    btn.textContent = '✓ Added';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = '+ Add'; btn.classList.remove('added'); }, 1200);
  }

  saveCart();
  updateCartUI();
}

/* ── 6. REMOVE FROM CART ─────────────────────────────────── */
function removeFromCart(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) showToast(`🗑 ${item.name} removed`);
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

/* ── 7. UPDATE QUANTITY (Bonus) ──────────────────────────── */
function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart();
  updateCartUI();
}

/* ── 8. CALCULATE TOTALS ─────────────────────────────────── */
function calculateTotals() {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax      = Math.round(subtotal * 0.18);
  const total    = subtotal + tax;
  return { subtotal, tax, total };
}

/* ── 9. UPDATE CART UI ───────────────────────────────────── */
function updateCartUI() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCountEl.textContent = totalItems;

  const { subtotal, total } = calculateTotals();
  cartSubEl.textContent   = `₹${subtotal.toLocaleString('en-IN')}`;
  cartTotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  checkoutBtn.disabled    = cart.length === 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="icon">🛒</div>
        <p>Your cart is empty.<br>Add some products!</p>
      </div>`;
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">
          ₹${item.price.toLocaleString('en-IN')} × ${item.qty}
          = ₹${(item.price * item.qty).toLocaleString('en-IN')}
        </div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="updateQty(${item.id},-1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.id},+1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
    </div>`).join('');
}

/* ── 10. CART OPEN / CLOSE ───────────────────────────────── */
function openCart()  { cartSidebar.classList.add('open'); cartOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; }

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

/* ── 11. CHECKOUT MODAL ──────────────────────────────────── */
checkoutBtn.addEventListener('click', () => {
  const { tax, total } = calculateTotals();
  summaryItems.innerHTML = cart.map(i =>
    `<div class="row"><span>${i.emoji} ${i.name} × ${i.qty}</span>
     <span>₹${(i.price * i.qty).toLocaleString('en-IN')}</span></div>`
  ).join('') + `<div class="row"><span>GST (18%)</span><span>₹${tax.toLocaleString('en-IN')}</span></div>`;
  summaryTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
  checkoutForm.style.display = '';
  confirmView.style.display  = 'none';
  checkoutOverlay.classList.add('open');
  closeCart();
});

checkoutOverlay.addEventListener('click', e => { if (e.target === checkoutOverlay) closeCheckout(); });
function closeCheckout() { checkoutOverlay.classList.remove('open'); }

/* ── 12. PLACE ORDER ─────────────────────────────────────── */
document.getElementById('place-order-btn').addEventListener('click', () => {
  const name = document.getElementById('cust-name').value.trim();
  if (!name) { showToast('⚠️ Please enter your name'); return; }

  const orderId = 'ORD-' + Math.random().toString(36).substr(2,8).toUpperCase();
  checkoutForm.style.display = 'none';
  confirmView.style.display  = '';
  document.getElementById('order-id-display').innerHTML = `Order ID: <strong>${orderId}</strong>`;
  document.getElementById('confirm-name').textContent = name;

  cart = [];
  saveCart();
  updateCartUI();
  document.getElementById('cust-name').value    = '';
  document.getElementById('cust-address').value = '';
});

document.getElementById('continue-btn').addEventListener('click', closeCheckout);
document.getElementById('cancel-checkout').addEventListener('click', closeCheckout);

/* ── 13. TOAST ───────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg) {
  toastEl.querySelector('.t-msg').textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
}

/* ── 14. SESSION STORAGE (Bonus) ─────────────────────────── */
function saveCart() {
  try { sessionStorage.setItem('shopease_cart', JSON.stringify(cart)); } catch(e) {}
}
function loadCart() {
  try { const s = sessionStorage.getItem('shopease_cart'); if (s) cart = JSON.parse(s); } catch(e) { cart = []; }
}

/* ── 15. INIT ────────────────────────────────────────────── */
(function init() {
  loadCart();
  renderProducts();
  updateCartUI();
})();