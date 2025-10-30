// Datos de ejemplo. Reemplaza con los productos del PDF y sus imágenes.
const products = [
	{ id: 'vino-01', name: 'Vino Tinto Reserva', description: 'Notas de frutos rojos y madera suave.', image: 'assets/placeholder-1.jpg' },
	{ id: 'vino-02', name: 'Vino Blanco Joven', description: 'Aromas cítricos y final fresco.', image: 'assets/placeholder-2.jpg' },
	{ id: 'vino-03', name: 'Rosé Seco', description: 'Carácter floral y elegante.', image: 'assets/placeholder-3.jpg' },
	{ id: 'vino-04', name: 'Gran Cuvée', description: 'Blend equilibrado y complejo.', image: 'assets/placeholder-4.jpg' },
	{ id: 'vino-05', name: 'Edición Limitada', description: 'Crianza prolongada, gran estructura.', image: 'assets/placeholder-5.jpg' },
	{ id: 'vino-06', name: 'Espumante Brut', description: 'Burbuja fina y persistente.', image: 'assets/placeholder-6.jpg' },
];

// Selectores base
const entryView = document.getElementById('entry');
const catalogView = document.getElementById('catalog');
const entryForm = document.getElementById('entryForm');
const productsEl = document.getElementById('products');
const cartCountEl = document.getElementById('cartCount');
const viewCartBtn = document.getElementById('viewCartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartListEl = document.getElementById('cartList');
const cartTotalUnitsEl = document.getElementById('cartTotalUnits');

// Estado del carrito: { [productId]: quantity }
const CART_KEY = 'mosela.cart.v1';
const VISITOR_KEY = 'mosela.visitor.v1';

function loadCart(){
	try{ return JSON.parse(localStorage.getItem(CART_KEY) || '{}'); }
	catch{ return {}; }
}
function saveCart(cart){
	localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function getCartTotalUnits(cart){
	return Object.values(cart).reduce((a,b)=>a+b,0);
}

let cart = loadCart();

function updateCartCount(){
	cartCountEl.textContent = String(getCartTotalUnits(cart));
}

function renderProducts(){
	productsEl.innerHTML = products.map(p => {
		const qty = cart[p.id] || 0;
		return `
			<article class="product-card" data-id="${p.id}">
				<a class="product-media" href="#" tabindex="-1" aria-hidden="true">
					<img src="${p.image}" alt="${p.name}">
				</a>
				<div class="product-body">
					<h3 class="product-name">${p.name}</h3>
					<p class="product-desc">${p.description || ''}</p>
					<div class="product-ctrl">
						<div class="qty">
							<button type="button" class="qty-minus" aria-label="Restar">–</button>
							<input type="number" class="qty-input" min="0" step="1" value="${qty}">
							<button type="button" class="qty-plus" aria-label="Sumar">+</button>
						</div>
						<button class="btn btn-primary add-to-cart" type="button">Agregar al carrito</button>
					</div>
				</div>
			</article>
		`;
	}).join('');
}

function clampInt(n){
	const v = Number.parseInt(n,10);
	return Number.isFinite(v) && v >= 0 ? v : 0;
}

// Handlers de cantidad y agregar
productsEl?.addEventListener('click', (e) => {
	const target = e.target;
	const card = target.closest('.product-card');
	if(!card) return;
	const id = card.getAttribute('data-id');
	const input = card.querySelector('.qty-input');
	let val = clampInt(input.value);

	if(target.classList.contains('qty-minus')){
		val = Math.max(0, val - 1);
		input.value = String(val);
	}
	if(target.classList.contains('qty-plus')){
		val = val + 1;
		input.value = String(val);
	}
	if(target.classList.contains('add-to-cart')){
		cart[id] = clampInt(input.value);
		saveCart(cart);
		updateCartCount();
	}
});

productsEl?.addEventListener('input', (e) => {
	const target = e.target;
	if(!(target instanceof HTMLInputElement)) return;
	if(!target.classList.contains('qty-input')) return;
	const card = target.closest('.product-card');
	if(!card) return;
	const id = card.getAttribute('data-id');
	cart[id] = clampInt(target.value);
	saveCart(cart);
	updateCartCount();
});

// Modal
function openCart(){
	buildCartList();
	cartModal.setAttribute('aria-hidden', 'false');
}
function closeCart(){
	cartModal.setAttribute('aria-hidden', 'true');
}
function buildCartList(){
	const items = Object.entries(cart).filter(([,q]) => q>0);
	if(items.length === 0){
		cartListEl.innerHTML = '<li class="cart-item"><span>No hay productos en el pedido.</span></li>';
		cartTotalUnitsEl.textContent = '0';
		return;
	}
	cartListEl.innerHTML = items.map(([id, qty]) => {
		const prod = products.find(p => p.id === id);
		const name = prod ? prod.name : id;
		return `<li class="cart-item"><span class="name">${name}</span><span class="qty">x${qty}</span></li>`;
	}).join('');
	cartTotalUnitsEl.textContent = String(getCartTotalUnits(cart));
}

viewCartBtn?.addEventListener('click', openCart);
closeCartBtn?.addEventListener('click', closeCart);
cartModal?.addEventListener('click', (e) => {
	const target = e.target;
	if(target && target.hasAttribute('data-close')) closeCart();
});

// Entry form
entryForm?.addEventListener('submit', (e) => {
	e.preventDefault();
	const visitorName = document.getElementById('visitorName').value.trim();
	const businessName = document.getElementById('businessName').value.trim();
	sessionStorage.setItem(VISITOR_KEY, JSON.stringify({ visitorName, businessName, ts: Date.now() }));
	showCatalog();
});

function showCatalog(){
	entryView.classList.add('hidden');
	catalogView.classList.remove('hidden');
	window.scrollTo(0,0);
}

function maybeShowCatalog(){
	const stored = sessionStorage.getItem(VISITOR_KEY);
	if(stored){ showCatalog(); }
}

// Inicialización
renderProducts();
updateCartCount();
maybeShowCatalog();

// Botón enviar pedido (placeholder)
document.getElementById('sendOrderBtn')?.addEventListener('click', () => {
	// No hace nada: solo placeholder visual para pruebas.
	closeCart();
});

