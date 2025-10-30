// Configuración principal
const VISITOR_KEY = 'mosela.visitor.v1';
const CART_KEY = 'mosela.cart.items.v1';

// Inventario basado en imágenes provistas (nombres amigables para mostrar)
const catalogItems = [
	{ imagen: 'sabajon-.png', nombre: 'Sabajón Gran Brindis', opciones: [
		{ id:'sabajon-375ml', etiqueta:'375 ml', precio:'$17.600' },
		{ id:'sabajon-750ml', etiqueta:'750 ml', precio:'$32.500' },
	] },
	{ imagen: 'brandy-.png', nombre: 'Brandy Gran Brindis', opciones: [
		{ id:'brandy-375ml', etiqueta:'375 ml', precio:'$25.050' },
		{ id:'brandy-750ml', etiqueta:'750 ml', precio:'$46.250' },
	] },
	{ imagen: 'vinotintoespumosorosado.png', nombre: 'Vino Espumoso Rosado', opciones: [
		{ id:'espumoso-rosado-750ml', etiqueta:'750 ml', precio:'$19.450' },
		{ id:'espumoso-rosado-2600ml', etiqueta:'2600 ml', precio:'$88.500' },
	] },
	{ imagen: 'vinotintoespumosoblanco.png', nombre: 'Vino Espumoso Blanco', opciones: [
		{ id:'espumoso-blanco-750ml', etiqueta:'750 ml', precio:'$19.450' },
		{ id:'espumoso-blanco-2600ml', etiqueta:'2600 ml', precio:'$88.500' },
	] },
	{ imagen: 'vinotintotonelito-.png', nombre: 'Vino Tinto Tonelito', opciones: [ { id:'vino-tinto-tonelito-1000ml', etiqueta:'1000 ml', precio:'' } ] },

	// Resto de imágenes (una sola variante por defecto)
	{ imagen: 'vinotintoseco-.png', nombre: 'Vino Tinto Seco', opciones: [ { id:'vino-tinto-seco-750ml', etiqueta:'750 ml', precio:'' } ] },
	{ imagen: 'vinoblancoseco-.png', nombre: 'Vino Blanco Seco', opciones: [ { id:'vino-blanco-seco-750ml', etiqueta:'750 ml', precio:'' } ] },
	{ imagen: 'licordevodka-.png', nombre: 'Licor de Vodka', opciones: [ { id:'licor-vodka-750ml', etiqueta:'750 ml', precio:'' } ] },
	{ imagen: 'vinoblanco-.png', nombre: 'Vino Blanco', opciones: [ { id:'vino-blanco-750ml', etiqueta:'750 ml', precio:'' } ] },
	{ imagen: 'vinoburbujeantemanzana-.png', nombre: 'Vino Burbujeante Manzana', opciones: [ { id:'vino-burbujeante-manzana-750ml', etiqueta:'750 ml', precio:'' } ] },
	{ imagen: 'vinocerezaa.png', nombre: 'Vino de Cereza', opciones: [ { id:'vino-cereza-750ml', etiqueta:'750 ml', precio:'' } ] },
	{ imagen: 'whisky-.png', nombre: 'Whisky', opciones: [ { id:'whisky-750ml', etiqueta:'750 ml', precio:'' } ] },
	{ imagen: 'whiskibalon.png', nombre: 'Whisky Balón', opciones: [ { id:'whiskibalon-750ml', etiqueta:'750 ml', precio:'' } ] },
	{ imagen: 'cremadewhisky-.png', nombre: 'Crema de Whisky', opciones: [ { id:'crema-whisky-750ml', etiqueta:'750 ml', precio:'' } ] },
];

// Almacenamiento
function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; } }
function saveCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); }
function cartTotalUnits(items){ return items.reduce((sum, it) => sum + (Number(it.cantidad)||0), 0); }
let cartItems = loadCart();

// Selectores
const entryView = document.getElementById('entry');
const catalogView = document.getElementById('catalog');
const entryForm = document.getElementById('entryForm');
const productsEl = document.getElementById('products');
const viewCartBtn = document.getElementById('viewCartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartListEl = document.getElementById('cartList');
const cartTotalUnitsEl = document.getElementById('cartTotalUnits');
const cartTotalTextEl = document.getElementById('cartTotalText');

const generateReceiptBtn = document.getElementById('generateReceiptBtn');
const receiptView = document.getElementById('receiptView');
const receiptUserEl = document.getElementById('receiptUser');
const receiptListEl = document.getElementById('receiptList');
const receiptTotalEl = document.getElementById('receiptTotal');
const closeReceiptBtn = document.getElementById('closeReceiptBtn');
const resetCartBtn = document.getElementById('resetCartBtn');

function updateCartBadge(){
	const total = cartTotalUnits(cartItems);
	if(cartTotalTextEl){ cartTotalTextEl.textContent = `🛒 Total de unidades: ${total}`; }
}

function resetCart(){
	cartItems = [];
	saveCart(cartItems);
	updateCartBadge();
	buildCartList();
}

function resolveImagePath(name){ return `${name}`; }

function renderCatalog(){
	productsEl.innerHTML = catalogItems.map(item => {
		const imgSrc = resolveImagePath(item.imagen);
		const optionsHtml = item.opciones.map(op => {
			const inputId = `${op.id}-qty`;
			return `
				<div class="option-group" data-item-id="${op.id}" data-img="${imgSrc}" data-name="${item.nombre}" data-label="${op.etiqueta}" data-precio="${op.precio||''}">
					<div class="option-label">${op.etiqueta}</div>
					<div class="option-controls">
						<div class="qty">
							<button type="button" class="qty-minus" aria-label="Restar">–</button>
							<input id="${inputId}" type="number" class="qty-input" min="0" step="1" value="1">
							<button type="button" class="qty-plus" aria-label="Sumar">+</button>
						</div>
						<button class="btn-add add-btn" type="button">Agregar al carrito</button>
					</div>
				</div>
			`;
		}).join('');

		return `
			<article class="product-card">
				<div class="product-media">
					<img src="${imgSrc}" alt="${item.nombre}">
				</div>
				<div class="product-body">
					<h3 class="product-name">${item.nombre}</h3>
					${optionsHtml}
				</div>
			</article>
		`;
	}).join('');
}

function clampInt(v){ const n = parseInt(String(v),10); return Number.isFinite(n) && n >= 0 ? n : 0; }

// Exponer addToCart para botones inline opcionales
window.addToCart = function(id){
	for(const item of catalogItems){
		const op = (item.opciones||[]).find(o => o.id === id);
		if(op){
			cartItems.push({ id: op.id, nombre: `${item.nombre} (${op.etiqueta})`, cantidad: 1, precio: op.precio||'', imagen: resolveImagePath(item.imagen) });
			saveCart(cartItems); updateCartBadge(); return;
		}
	}
}

// Delegación de eventos
productsEl.addEventListener('click', (e) => {
	const target = e.target;
	const optionGroup = target.closest('.option-group');
	if(!optionGroup) return;
	const input = optionGroup.querySelector('.qty-input');
	let val = clampInt(input.value);
	if(target.classList.contains('qty-minus')){ val = Math.max(0, val - 1); input.value = String(val); }
	if(target.classList.contains('qty-plus')){ val = val + 1; input.value = String(val); }
	if(target.classList.contains('add-btn')){
		const cantidad = Math.max(1, clampInt(input.value));
		const id = optionGroup.getAttribute('data-item-id');
		const nombreBase = optionGroup.getAttribute('data-name') || '';
		const etiqueta = optionGroup.getAttribute('data-label') || '';
		const precioTxt = optionGroup.getAttribute('data-precio') || '';
		const imagen = optionGroup.getAttribute('data-img') || '';
		cartItems.push({ id, nombre: etiqueta ? `${nombreBase} (${etiqueta})` : nombreBase, cantidad, precio: precioTxt, imagen });
		saveCart(cartItems); updateCartBadge(); input.value = '1';
	}
});

productsEl.addEventListener('input', (e) => {
	const target = e.target;
	if(!(target instanceof HTMLInputElement)) return;
	if(!target.classList.contains('qty-input')) return;
	target.value = String(clampInt(target.value));
});

// Modal
function openCart(){ buildCartList(); cartModal.setAttribute('aria-hidden','false'); }
function closeCart(){ cartModal.setAttribute('aria-hidden','true'); }

function buildCartList(){
	if(cartItems.length === 0){
		cartListEl.innerHTML = '<li class="cart-item"><span>No hay productos en el pedido.</span></li>';
		cartTotalUnitsEl.textContent = '0';
		return;
	}
	cartListEl.innerHTML = cartItems.map((it) => `
		<li class="cart-item">
			<div style="display:flex; align-items:center; gap:.6rem;">
				<img src="${it.imagen}" alt="${it.nombre}" style="width:48px; height:auto; border-radius:6px; border:1px solid rgba(0,0,0,.06);">
				<div>
					<div class="name">${it.nombre}</div>
					${it.precio ? `<div class="price" style="color:var(--color-olive); font-size:.9rem">${it.precio}</div>` : ''}
				</div>
			</div>
			<div class="qty">x${it.cantidad}</div>
		</li>
	`).join('');
	cartTotalUnitsEl.textContent = String(cartTotalUnits(cartItems));
}

viewCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartModal.addEventListener('click', (e) => { if(e.target && e.target.hasAttribute('data-close')) closeCart(); });

resetCartBtn?.addEventListener('click', resetCart);

document.getElementById('sendOrderBtn')?.addEventListener('click', () => { closeCart(); });

generateReceiptBtn?.addEventListener('click', () => {
	const user = (()=>{ try{ return JSON.parse(sessionStorage.getItem(VISITOR_KEY)||'{}'); }catch{ return {}; } })();
	receiptUserEl.textContent = `${user.visitorName||''} — ${user.businessName||''}`.trim();
	receiptListEl.innerHTML = cartItems.map(it => `
		<li><span>${it.nombre}${it.precio ? ` — ${it.precio}`:''}</span><strong>x${it.cantidad}</strong></li>
	`).join('');
	receiptTotalEl.textContent = String(cartTotalUnits(cartItems));
	receiptView.classList.add('visible');
	receiptView.setAttribute('aria-hidden','false');
});

closeReceiptBtn?.addEventListener('click', () => {
	receiptView.classList.remove('visible');
	receiptView.setAttribute('aria-hidden','true');
});

// Entry form
entryForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const visitorName = document.getElementById('visitorName').value.trim();
	const businessName = document.getElementById('businessName').value.trim();
	sessionStorage.setItem(VISITOR_KEY, JSON.stringify({ visitorName, businessName, ts: Date.now() }));
	showCatalog();
});

function showCatalog(){ entryView.classList.add('hidden'); catalogView.classList.remove('hidden'); window.scrollTo(0,0); }
function maybeShowCatalog(){ const stored = sessionStorage.getItem(VISITOR_KEY); if(stored){ showCatalog(); } }

// Init
renderCatalog();
updateCartBadge();
maybeShowCatalog();
