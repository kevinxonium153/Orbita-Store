/* =========================================
   Órbita Store — Lógica de la tienda
   ========================================= */

// ---------- Catálogo ----------
// Edita esta lista para agregar, quitar o cambiar productos.
// "image" es opcional: si la agregas (ej. "img/camiseta.jpg") se usa en lugar del emoji.
const PRODUCTS = [
  { id: 1, name: "Camiseta Órbita",      category: "ropa",       price: 450,  emoji: "👕", color: "#3b2a8a", badge: "Nuevo" },
  { id: 2, name: "Hoodie Galaxia",       category: "ropa",       price: 1150, emoji: "🧥", color: "#1f3a6b" },
  { id: 3, name: "Gorra Satélite",       category: "accesorios", price: 380,  emoji: "🧢", color: "#4a1f5c" },
  { id: 4, name: "Mochila Cosmos",       category: "accesorios", price: 990,  emoji: "🎒", color: "#1d4a4f", badge: "Top" },
  { id: 5, name: "Audífonos Nebula",     category: "tecnologia", price: 1450, emoji: "🎧", color: "#2b2f6b" },
  { id: 6, name: "Reloj Inteligente",    category: "tecnologia", price: 2300, emoji: "⌚", color: "#3d2459" },
  { id: 7, name: "Lentes de Sol Eclipse",category: "accesorios", price: 520,  emoji: "🕶️", color: "#202a4d" },
  { id: 8, name: "Tenis Propulsión",     category: "ropa",       price: 1850, emoji: "👟", color: "#3a1f4f", badge: "-15%" },
  { id: 9, name: "Bocina Bluetooth",     category: "tecnologia", price: 890,  emoji: "🔊", color: "#163f55" },
];

const CATEGORY_LABELS = {
  ropa: "Ropa",
  accesorios: "Accesorios",
  tecnologia: "Tecnología",
};

const CART_KEY = "orbita-cart";

// ---------- Utilidades ----------
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const formatPrice = (value) =>
  "L " + value.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

function productVisual(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}" loading="lazy">`;
  }
  return `<span aria-hidden="true">${product.emoji}</span>`;
}

// ---------- Estado ----------
const state = {
  category: "todos",
  query: "",
  cart: loadCart(),
};

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    // Descarta productos que ya no existan en el catálogo
    return Array.isArray(saved) ? saved.filter((item) => findProduct(item.id)) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
  } catch {
    /* Almacenamiento no disponible: el carrito funciona solo en esta visita */
  }
}

// ---------- Productos ----------
function renderProducts() {
  const grid = $("#productGrid");
  const query = state.query.trim().toLowerCase();

  const visible = PRODUCTS.filter((p) => {
    const matchesCategory = state.category === "todos" || p.category === state.category;
    const matchesQuery = !query || p.name.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  grid.innerHTML = visible
    .map(
      (p, i) => `
      <article class="product-card" style="animation-delay:${i * 50}ms">
        <div class="product-card__media" style="background:${p.color}">
          ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ""}
          ${productVisual(p)}
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${CATEGORY_LABELS[p.category]}</span>
          <h3 class="product-card__name">${p.name}</h3>
          <div class="product-card__footer">
            <span class="product-card__price">${formatPrice(p.price)}</span>
            <button class="add-btn" data-id="${p.id}">Agregar</button>
          </div>
        </div>
      </article>`
    )
    .join("");

  $("#emptyState").hidden = visible.length > 0;
}

// ---------- Carrito ----------
function addToCart(id) {
  const item = state.cart.find((i) => i.id === id);
  if (item) {
    item.qty += 1;
  } else {
    state.cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
  bumpCount();
  showToast(`${findProduct(id).name} agregado al carrito`);
}

function changeQty(id, delta) {
  const item = state.cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((i) => i.id !== id);
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

function clearCart() {
  state.cart = [];
  saveCart();
  renderCart();
}

function renderCart() {
  const list = $("#cartItems");
  let total = 0;
  let count = 0;

  list.innerHTML = state.cart
    .map((item) => {
      const p = findProduct(item.id);
      total += p.price * item.qty;
      count += item.qty;
      return `
        <li class="cart-item">
          <div class="cart-item__thumb" style="background:${p.color}">${productVisual(p)}</div>
          <div>
            <p class="cart-item__name">${p.name}</p>
            <p class="cart-item__price">${formatPrice(p.price)}</p>
            <div class="qty">
              <button data-action="dec" data-id="${p.id}" aria-label="Quitar uno">−</button>
              <span>${item.qty}</span>
              <button data-action="inc" data-id="${p.id}" aria-label="Agregar uno">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-action="remove" data-id="${p.id}">Eliminar</button>
        </li>`;
    })
    .join("");

  const isEmpty = state.cart.length === 0;
  $("#cartEmpty").hidden = !isEmpty;
  $("#checkoutBtn").disabled = isEmpty;
  $("#clearCartBtn").disabled = isEmpty;
  $("#cartTotal").textContent = formatPrice(total);
  $("#cartCount").textContent = count;
}

function bumpCount() {
  const badge = $("#cartCount");
  badge.classList.remove("bump");
  void badge.offsetWidth; // reinicia la animación
  badge.classList.add("bump");
}

function openCart() {
  $("#cart").classList.add("is-open");
  $("#cart").setAttribute("aria-hidden", "false");
  $("#overlay").hidden = false;
  document.body.classList.add("no-scroll");
}

function closeCart() {
  $("#cart").classList.remove("is-open");
  $("#cart").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;
  document.body.classList.remove("no-scroll");
}

function checkout() {
  if (state.cart.length === 0) return;
  const total = $("#cartTotal").textContent;
  clearCart();
  closeCart();
  showToast(`¡Pedido confirmado por ${total}! Gracias por tu compra 🚀`);
}

// ---------- Notificación ----------
let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2500);
}

// ---------- Formulario de contacto ----------
function validateField(field) {
  const wrapper = field.closest(".form__field");
  const error = wrapper.querySelector(".form__error");
  let message = "";

  if (!field.value.trim()) {
    message = "Este campo es obligatorio.";
  } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    message = "Ingresa un correo válido.";
  }

  wrapper.classList.toggle("has-error", Boolean(message));
  error.textContent = message;
  return !message;
}

function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const fields = [...form.querySelectorAll("input, textarea")];
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) return;

  form.reset();
  const success = $("#formSuccess");
  success.hidden = false;
  setTimeout(() => (success.hidden = true), 4000);
}

// ---------- Contadores animados ----------
function animateCounters() {
  const counters = $$("[data-count]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const start = performance.now();
        const duration = 1200;

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(target * progress).toLocaleString("es-HN") + (progress === 1 ? "+" : "");
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => observer.observe(c));
}

// ---------- Menú móvil ----------
function toggleMenu(force) {
  const btn = $("#menuBtn");
  const open = typeof force === "boolean" ? force : btn.getAttribute("aria-expanded") !== "true";
  btn.setAttribute("aria-expanded", String(open));
  $("#nav").classList.toggle("is-open", open);
}

// ---------- Eventos ----------
function bindEvents() {
  // Filtros
  $("#filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    $$(".filter").forEach((f) => f.classList.toggle("is-active", f === btn));
    state.category = btn.dataset.category;
    renderProducts();
  });

  // Búsqueda
  $("#search").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderProducts();
  });

  // Agregar al carrito
  $("#productGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (btn) addToCart(Number(btn.dataset.id));
  });

  // Acciones dentro del carrito
  $("#cartItems").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === "inc") changeQty(id, 1);
    if (btn.dataset.action === "dec") changeQty(id, -1);
    if (btn.dataset.action === "remove") removeFromCart(id);
  });

  $("#cartBtn").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);
  $("#checkoutBtn").addEventListener("click", checkout);
  $("#clearCartBtn").addEventListener("click", clearCart);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  // Menú móvil
  $("#menuBtn").addEventListener("click", () => toggleMenu());
  $$(".nav__link").forEach((link) => link.addEventListener("click", () => toggleMenu(false)));

  // Formulario
  const form = $("#contactForm");
  form.addEventListener("submit", handleContactSubmit);
  form.querySelectorAll("input, textarea").forEach((field) =>
    field.addEventListener("blur", () => validateField(field))
  );
}

// ---------- Inicio ----------
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  renderProducts();
  renderCart();
  bindEvents();
  animateCounters();
});
