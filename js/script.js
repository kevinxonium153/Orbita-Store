/* =========================================
   ÓRBITA — Lógica de la tienda
   ========================================= */

// ---------- Datos de contacto ----------
// Cambia aquí y se actualiza en toda la página (contacto, pie y pedidos por WhatsApp).
const CONTACT = {
  whatsapp: "50400000000", // código de país + número, sin espacios ni "+". PENDIENTE: número real.
  whatsappLabel: "+504 0000-0000",
  instagram: "orbita.hn",
  tiktok: "orbita.hn",
  email: "hola@orbita.hn",
};

// ---------- Catálogo ----------
// type "photo" usa la imagen indicada; type "poster" dibuja el mockup del cuadro NFC.
const PRODUCTS = [
  {
    id: 1,
    name: "Edición Standard",
    category: "llaveros",
    price: 322,
    note: "+ envío contra entrega",
    desc: "Un mini CD con tu portada, chip NFC programado a tu álbum o playlist. Estuche acrílico transparente y cadena de llavero.",
    type: "photo",
    image: "img/mini-cd-llavero.jpg",
    alt: "Mini CD llavero ÓRBITA edición Standard, estuche transparente con disco, portada y mini póster",
    badge: "N.º 01",
  },
  {
    id: 2,
    name: "Edición Fan Club",
    category: "llaveros",
    price: 780,
    note: "Set de 3 + envío",
    desc: "Set de tres mini CD por era o artista, con tarjetas coleccionables numeradas y empaque especial.",
    type: "photo",
    image: "img/mini-cd-llavero.jpg",
    alt: "Set de tres mini CD llavero ÓRBITA edición Fan Club con tarjetas numeradas",
    badge: "N.º 02",
    tint: "fanclub",
  },
  {
    id: 3,
    name: "Edición Personalizada",
    category: "llaveros",
    price: 403,
    note: "+ envío contra entrega",
    desc: "Sube tu propia portada y audio. Ideal para artistas independientes, negocios o regalos con identidad propia.",
    type: "photo",
    image: "img/mini-cd-llavero.jpg",
    alt: "Mini CD llavero ÓRBITA edición Personalizada con arte y audio propios",
    badge: "N.º 03",
    tint: "custom",
  },
  {
    id: 4,
    name: "Cuadro NFC — A4 · 21×30 cm",
    category: "cuadros",
    price: 538,
    note: "+ envío contra entrega",
    desc: "Impresión enmarcada de tu portada y tracklist, con chip NFC oculto en el marco. Ideal para escritorio o repisa.",
    type: "poster",
    badge: "Chico",
  },
  {
    id: 5,
    name: "Cuadro NFC — A3 · 30×42 cm",
    category: "cuadros",
    price: 807,
    note: "+ envío contra entrega",
    desc: "El mismo diseño en tamaño mediano, pensado para pared — el punto medio entre detalle y presencia.",
    type: "poster",
    badge: "Mediano",
  },
  {
    id: 6,
    name: "Cuadro NFC — 40×60 cm",
    category: "cuadros",
    price: 1479,
    note: "+ envío contra entrega",
    desc: "Formato de pared grande, para hacer del álbum el centro del cuarto. Marco reforzado por el mayor tamaño.",
    type: "poster",
    badge: "Grande",
  },
  {
    id: 7,
    name: "Audífonos TWS Órbita",
    category: "audio",
    price: 300,
    note: "+ envío contra entrega",
    desc: "Audífonos inalámbricos con estuche de carga, cordón incluido y logo Órbita grabado. Empaque tipo caja de regalo.",
    type: "photo",
    image: "img/audifonos-tws.jpg",
    alt: "Audífonos TWS Órbita, estuche blanco con logo grabado y cordón, sobre superficie oscura",
    badge: "N.º 04",
  },
];

const CATEGORY_LABELS = {
  llaveros: "Llavero NFC",
  cuadros: "Cuadro NFC",
  audio: "Audio",
};

const CART_KEY = "orbita-cart";

// ---------- Utilidades ----------
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const formatPrice = (value) =>
  "L " + value.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

const whatsappUrl = (text) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

const BRAND_MARK =
  '<svg class="brand-mark" viewBox="0 0 200 200" aria-hidden="true"><circle class="mark-ring" cx="100" cy="100" r="50" fill="none" stroke-width="9"/><ellipse class="mark-orbit" cx="100" cy="100" rx="88" ry="40" fill="none" stroke-width="9" transform="rotate(-28 100 100)"/><circle class="mark-dot" cx="171.6" cy="91.1" r="13"/></svg>';

function posterMockup() {
  const tracks = [78, 60, 85, 52, 70, 64].map((w) => `<span style="width:${w}%"></span>`).join("");
  const bars = [60, 100, 40, 80, 55, 90, 45, 70, 100, 50].map((h) => `<span style="height:${h}%"></span>`).join("");
  return `
    <div class="poster" role="img" aria-label="Mockup de cuadro NFC con portada, tracklist y código para tocar">
      <div class="poster__art">
        ${BRAND_MARK}
        <span class="poster__label">Tu portada aquí</span>
      </div>
      <div class="poster__band">
        <div class="poster__artist">Nombre del artista</div>
        <div class="poster__tracks">${tracks}</div>
        <div class="poster__title">Nombre del álbum</div>
        <div class="poster__code">
          <div class="poster__bars">${bars}</div>
          <span class="poster__code-label">Toca para reproducir</span>
        </div>
      </div>
    </div>`;
}

function productMedia(p) {
  if (p.type === "poster") {
    return `<span class="badge badge--right">${p.badge}</span>${posterMockup()}`;
  }
  return `
    <span class="badge">${p.badge}</span>
    <img src="${p.image}" alt="${p.alt}" loading="lazy" width="800" height="800">
    ${p.tint ? `<div class="tint tint--${p.tint}"></div>` : ""}`;
}

function productThumb(p) {
  return p.type === "poster" ? BRAND_MARK : `<img src="${p.image}" alt="">`;
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
  const query = state.query.trim().toLowerCase();

  const visible = PRODUCTS.filter((p) => {
    const matchesCategory = state.category === "todos" || p.category === state.category;
    const matchesQuery =
      !query || p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  $("#productGrid").innerHTML = visible
    .map(
      (p, i) => `
      <article class="product-card" style="animation-delay:${i * 50}ms">
        <div class="product-card__media">${productMedia(p)}</div>
        <div class="product-card__body">
          <span class="product-card__category">${CATEGORY_LABELS[p.category]}</span>
          <h3 class="product-card__name">${p.name}</h3>
          <p class="product-card__desc">${p.desc}</p>
          <div class="product-card__footer">
            <span class="product-card__price">${formatPrice(p.price)}<small>${p.note}</small></span>
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
  showToast(`${findProduct(id).name} agregado al pedido`);
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

function cartTotal() {
  return state.cart.reduce((sum, item) => sum + findProduct(item.id).price * item.qty, 0);
}

function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);

  $("#cartItems").innerHTML = state.cart
    .map((item) => {
      const p = findProduct(item.id);
      return `
        <li class="cart-item">
          <div class="cart-item__thumb">${productThumb(p)}</div>
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
  $("#cartTotal").textContent = formatPrice(cartTotal());
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

// Arma el mensaje del pedido y lo abre en WhatsApp
function checkout() {
  if (state.cart.length === 0) return;

  const lines = state.cart.map((item) => {
    const p = findProduct(item.id);
    return `• ${item.qty} × ${p.name} — ${formatPrice(p.price * item.qty)}`;
  });

  const message = [
    "Hola ÓRBITA, quiero hacer este pedido:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatPrice(cartTotal())} + envío contra entrega`,
  ].join("\n");

  window.open(whatsappUrl(message), "_blank", "noopener");
}

// ---------- Contacto ----------
function renderContact() {
  const links = [
    {
      label: "WhatsApp",
      value: CONTACT.whatsappLabel,
      href: whatsappUrl("Hola, quiero información sobre ÓRBITA"),
    },
    { label: "Instagram", value: `@${CONTACT.instagram}`, href: `https://instagram.com/${CONTACT.instagram}` },
    { label: "Correo", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  ];

  $("#contactLinks").innerHTML = links
    .map(
      (l) => `
      <a class="contact-row" href="${l.href}" ${l.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
        <span class="contact-row__label">${l.label}</span>
        <span class="contact-row__value">${l.value} →</span>
      </a>`
    )
    .join("");

  $("#footerSocial").innerHTML = `
    <a href="https://instagram.com/${CONTACT.instagram}" target="_blank" rel="noopener">Instagram</a>
    <a href="https://tiktok.com/@${CONTACT.tiktok}" target="_blank" rel="noopener">TikTok</a>
    <a href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`;
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
}

// ---------- Inicio ----------
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  renderContact();
  renderProducts();
  renderCart();
  bindEvents();
});
