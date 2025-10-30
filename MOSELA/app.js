/*
  Catálogo MOSELA — Lógica de front-end

  Referencia al PDF fuente:
  - "CATALOGO MOSELA vinos (1)"

  Notas de contenido:
  - Si no se pudo extraer automáticamente el contenido del PDF, reemplace los campos
    de la constante PRODUCTS con los textos/imágenes exactos del PDF.

  Regla crítica (nuevo requerimiento): No mostrar precios en ninguna parte.
  - El carrito SOLO contabiliza unidades. El único cálculo permitido es sumatoria de cantidades.
*/

// Claves de storage
const STORAGE_KEYS = {
  visitor: 'mosela:visitor',
  cart: 'mosela:cart'
};

// Datos del visitante (se guardan en sessionStorage)
function saveVisitor(name, business) {
  const payload = { name, business };
  sessionStorage.setItem(STORAGE_KEYS.visitor, JSON.stringify(payload));
}

function getVisitor() {
  const raw = sessionStorage.getItem(STORAGE_KEYS.visitor);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// Carrito (se guarda en localStorage para persistencia suave)
function readCart() {
  const raw = localStorage.getItem(STORAGE_KEYS.cart);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function writeCart(items) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
}

function getTotalUnits(items) {
  return items.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
}

// Productos del catálogo
// "image" debe apuntar a /assets/ con las imágenes extraídas del PDF
// Si no dispone del contenido, reemplace los placeholders con información real del PDF
const PRODUCTS = [
  {
    id: 'vino-01',
    name: 'Vino Tinto Orgánico — Placeholder',
    description: 'Descripción exacta según el PDF. Reemplazar con texto del PDF.',
    image: 'assets/vino-01.jpg' // Reemplace con imagen del PDF
  },
  {
    id: 'vino-02',
    name: 'Vino Blanco — Placeholder',
    description: 'Descripción exacta según el PDF. Reemplazar con texto del PDF.',
    image: 'assets/vino-02.jpg'
  },
  {
    id: 'vino-03',
    name: 'Vino Rosé — Placeholder',
    description: 'Descripción exacta según el PDF. Reemplazar con texto del PDF.',
    image: 'assets/vino-03.jpg'
  }
  // Agregue el resto de productos del PDF aquí, manteniendo el mismo esquema.
];

// Render del catálogo
function renderCatalog() {
  const container = document.getElementById('catalogo');
  if (!container) return;
  container.innerHTML = '';

  PRODUCTS.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-id', product.id);

    card.innerHTML = `
      <div class="card__media">
        <!-- Si no existen imágenes extraídas, use placeholders y reemplace en /assets/ -->
        <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/placeholder.svg'" />
      </div>
      <div class="card__body">
        <div class="card__title">${product.name}</div>
        <div class="card__desc">${product.description}</div>
        <div class="card__actions">
          <div class="qty">
            <button class="step" data-step="-1" aria-label="Disminuir">−</button>
            <input class="qty-input" type="number" min="1" value="1" aria-label="Cantidad" />
            <button class="step" data-step="1" aria-label="Incrementar">+</button>
          </div>
          <button class="btn btn--primary add-to-cart">Agregar al carrito</button>
        </div>
      </div>
    `;

    const qtyInput = card.querySelector('.qty-input');
    const stepBtns = card.querySelectorAll('.step');
    stepBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const delta = Number(btn.getAttribute('data-step')) || 0;
        const next = Math.max(1, (Number(qtyInput.value) || 1) + delta);
        qtyInput.value = next;
      });
    });

    const addBtn = card.querySelector('.add-to-cart');
    addBtn.addEventListener('click', () => {
      const qty = Math.max(1, Number(qtyInput.value) || 1);
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        quantity: qty
      });
    });

    container.appendChild(card);
  });
}

// Carrito
function addToCart(item) {
  const cart = readCart();
  const idx = cart.findIndex((it) => it.id === item.id);
  if (idx >= 0) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push({ ...item });
  }
  writeCart(cart);
  updateCartIndicators();
  openCart();
  renderCartList();
}

function updateCartIndicators() {
  const items = readCart();
  const units = getTotalUnits(items);
  const el = document.getElementById('cartUnits');
  if (el) el.textContent = `${units} unidades`;
  const totalEl = document.getElementById('unitsTotal');
  if (totalEl) totalEl.textContent = `Total unidades: ${units}`;
}

function openCart() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
}

function renderCartList() {
  const list = document.getElementById('cartList');
  if (!list) return;
  const cart = readCart();
  list.innerHTML = '';

  cart.forEach((it) => {
    const line = document.createElement('div');
    line.className = 'line';
    line.setAttribute('data-id', it.id);

    const product = PRODUCTS.find((p) => p.id === it.id);
    const imageSrc = (product && product.image) || it.image || 'assets/placeholder.svg';

    line.innerHTML = `
      <div class="line__media">
        <img src="${imageSrc}" alt="${it.name}" onerror="this.src='assets/placeholder.svg'" />
      </div>
      <div class="line__meta">
        <div class="line__title">${it.name}</div>
      </div>
      <div class="line__qty">
        <button class="step" data-action="dec" aria-label="Disminuir">−</button>
        <span class="line__count" aria-live="polite">${it.quantity}</span>
        <button class="step" data-action="inc" aria-label="Incrementar">+</button>
        <button class="icon-btn" data-action="remove" aria-label="Eliminar">🗑️</button>
      </div>
    `;

    const dec = line.querySelector('[data-action="dec"]');
    const inc = line.querySelector('[data-action="inc"]');
    const rem = line.querySelector('[data-action="remove"]');
    const count = line.querySelector('.line__count');

    dec.addEventListener('click', () => {
      const items = readCart();
      const index = items.findIndex((x) => x.id === it.id);
      if (index >= 0) {
        items[index].quantity = Math.max(0, items[index].quantity - 1);
        if (items[index].quantity === 0) items.splice(index, 1);
        writeCart(items);
        if (items[index]) count.textContent = String(items[index].quantity);
        else line.remove();
        updateCartIndicators();
      }
    });

    inc.addEventListener('click', () => {
      const items = readCart();
      const index = items.findIndex((x) => x.id === it.id);
      if (index >= 0) {
        items[index].quantity += 1;
        writeCart(items);
        count.textContent = String(items[index].quantity);
        updateCartIndicators();
      }
    });

    rem.addEventListener('click', () => {
      const items = readCart();
      const index = items.findIndex((x) => x.id === it.id);
      if (index >= 0) {
        items.splice(index, 1);
        writeCart(items);
        line.remove();
        updateCartIndicators();
      }
    });

    list.appendChild(line);
  });

  updateCartIndicators();
}

// Eventos UI
function initGate() {
  const overlay = document.getElementById('gateOverlay');
  const form = document.getElementById('gateForm');
  const visitName = document.getElementById('visitName');
  const businessName = document.getElementById('businessName');
  const errVisit = document.getElementById('errVisitName');
  const errBiz = document.getElementById('errBusinessName');

  if (!form) return;

  const visitor = getVisitor();
  if (visitor && overlay) {
    overlay.setAttribute('aria-hidden', 'true');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (visitName.value || '').trim();
    const business = (businessName.value || '').trim();
    let ok = true;
    errVisit.textContent = '';
    errBiz.textContent = '';
    if (!name) { errVisit.textContent = 'Este campo es obligatorio.'; ok = false; }
    if (!business) { errBiz.textContent = 'Este campo es obligatorio.'; ok = false; }
    if (!ok) return;
    saveVisitor(name, business);
    if (overlay) overlay.setAttribute('aria-hidden', 'true');
  });
}

function initCartBar() {
  const openBtn = document.getElementById('openCartBtn');
  const viewBtn = document.getElementById('viewCartBtn');
  const closeBtn = document.getElementById('closeCartBtn');
  const sendBtn = document.getElementById('sendOrderBtn');
  const modal = document.getElementById('cartModal');
  const modalPanel = modal ? modal.querySelector('.modal__panel') : null;

  const ensureCustomerInfo = () => {
    const info = document.getElementById('customerInfo');
    const v = getVisitor();
    if (info) {
      const name = v?.name || '—';
      const business = v?.business || '—';
      info.textContent = `Cliente: ${name} | Comercial: ${business}`;
    }
  };

  const openAction = () => {
    ensureCustomerInfo();
    openCart();
    renderCartList();
    // Enfocar botón de cierre al abrir para accesibilidad
    setTimeout(() => closeBtn && closeBtn.focus(), 0);
  };

  if (openBtn) openBtn.addEventListener('click', openAction);
  if (viewBtn) viewBtn.addEventListener('click', openAction);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);

  // Botón de enviar pedido (sin backend). Puede integrarse a futuro.
  if (sendBtn) sendBtn.addEventListener('click', () => {
    // Generar resumen de pedido (solo cantidades y precios como texto)
    const summary = composeOrderSummary();
    // Copiar al portapapeles para facilitar compartir
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(summary).then(() => {
        alert('Resumen copiado al portapapeles. Puede pegarlo en su app de mensajería.');
      }).catch(() => alert(summary));
    } else {
      alert(summary);
    }
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    const isOpen = modal && modal.getAttribute('aria-hidden') === 'false';
    if (!isOpen) return;
    if (e.key === 'Escape') {
      closeCart();
      // Devolver foco al botón de abrir
      setTimeout(() => viewBtn && viewBtn.focus(), 0);
    }
  });

  // Cerrar al hacer clic en el fondo
  if (modal) {
    modal.addEventListener('click', (e) => {
      const isOpen = modal.getAttribute('aria-hidden') === 'false';
      if (!isOpen) return;
      if (!modalPanel) return;
      if (!modalPanel.contains(e.target)) {
        closeCart();
        setTimeout(() => viewBtn && viewBtn.focus(), 0);
      }
    });
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initGate();
  renderCatalog();
  initCartBar();
  updateCartIndicators();
});

// Utilidad: resumen del pedido (sin cálculos monetarios)
function composeOrderSummary() {
  const v = getVisitor();
  const items = readCart();
  const units = getTotalUnits(items);
  const header = `Pedido MOSELA\nCliente: ${v?.name || '—'}\nComercial: ${v?.business || '—'}\n`;
  const lines = items.map((it) => `- ${it.name} — ${it.quantity} unidades`);
  const footer = `\nTotal unidades: ${units}`;
  return `${header}\n${lines.join('\n')}\n${footer}`;
}


