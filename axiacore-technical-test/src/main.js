import { products } from './data/products';
import './style.scss';

const DOC = window.document;
const ROOT_STYLES = DOC.documentElement.style;

let cartList = [];
let storeProduct = [];
let LIST_OF_PRODUCTS = [];
let FILTERED_PRODUCT = [];
const PRODUCT_STORAGE_KEY = 'MY_PRODUCTS';

const beersContainer = DOC.querySelector('#beers');
const templateBeer = DOC.querySelector('#template-beer').content;
const fragment = DOC.createDocumentFragment();

LIST_OF_PRODUCTS = [...products];

function showBeers(products) {
	fragment.textContent = '';
	beersContainer.textContent = '';

	FILTERED_PRODUCT = [...products];

	FILTERED_PRODUCT.forEach((product) => {
		const beerCard = templateBeer.querySelector('[data-beer="beer"]');
		const image = templateBeer.querySelector('[data-image="image"]');
		const title = templateBeer.querySelector('[data-title="title"]');
		const description = templateBeer.querySelector(
			'[data-description="description"]'
		);
		const price = templateBeer.querySelector('[data-price="price"]');
		const btnAdd = templateBeer.querySelector('[data-btn-add="btn-add"]');

		const ID = crypto.randomUUID();
		beerCard.id = ID;

		title.innerText = product?.name;
		image.src = `/assets/images/${product?.img}`;
		image.alt = product?.name;
		description.textContent = product?.description;
		price.textContent = formatMoney(product.price);
		btnAdd.id = ID;

		const cloneTemplate = document.importNode(templateBeer, true);
		fragment.append(cloneTemplate);
	});

	beersContainer.appendChild(fragment);
	readLocalStorage();
}

/* + clear input */
const restartBeerSample = (ev) => {
	if (ev.target.value.trim().length === 0) {
		showBeers(products);
		addCart();
	}
};

const addCart = () => {
	const btns = DOC.querySelectorAll("[data-btn-add='btn-add']");

	btns.forEach((btn) => {
		btn.addEventListener('click', (ev) => {
			console.log('click');
			const id = ev.target.id;

			const artc = DOC.getElementById(`${id}`);
			const titleProduct = artc.querySelector('[data-title]').textContent;

			const PRODUCT_FOUND = LIST_OF_PRODUCTS.find(
				(product) => replaceSpace(product.name) === replaceSpace(titleProduct)
			);

			if (!PRODUCT_FOUND) return;
			saveToLocalStorage(PRODUCT_FOUND);
			readLocalStorage();
		});
	});
};

const saveToLocalStorage = (product) => {
	storeProduct = [...cartList, product];

	if (!window.localStorage.getItem(PRODUCT_STORAGE_KEY)) {
		window.localStorage.setItem(
			PRODUCT_STORAGE_KEY,
			JSON.stringify(storeProduct)
		);
	} else {
		window.localStorage.setItem(
			PRODUCT_STORAGE_KEY,
			JSON.stringify(storeProduct)
		);
	}
	updateCart(storeProduct);
};

const readLocalStorage = () => {
	if (!window.localStorage.getItem(PRODUCT_STORAGE_KEY)) return;
	else {
		cartList = JSON.parse(window.localStorage.getItem(PRODUCT_STORAGE_KEY));
	}

	const cart = DOC.getElementById('cart');
	const amount = cart.querySelector('#cart-amount');

	amount.textContent = cartList.length;
	updateCart(cartList);
};

DOC.addEventListener('DOMContentLoaded', () => {
	showBeers(products);
	addCart();

	const formSearch = DOC.getElementById('form-search');

	formSearch.addEventListener('submit', (ev) => {
		ev.preventDefault();

		const data = new FormData(formSearch);

		const valueSearch = data.get('search-value');

		let filteredProduct = LIST_OF_PRODUCTS.filter((product) =>
			product.name.toLowerCase().includes(valueSearch.toLowerCase())
		);

		if (filteredProduct.length === 0) {
			filteredProduct = LIST_OF_PRODUCTS;
		}

		showBeers(filteredProduct);
		addCart();
	});

	// + clean input
	const inputText = formSearch.querySelector('input');
	inputText.addEventListener('keyup', restartBeerSample);

	// + Filter - modal
	const btnFilter = DOC.querySelector('#btn-filter');
	const modal = DOC.querySelector('#modal');
	const btnClose = modal.querySelector('#btn-close');
	const formFilter = DOC.querySelector('#form-filter');
	const btnClear = formFilter.querySelector('#btn-clear');
	const filterAmount = formFilter.querySelector('#filter-amount');

	btnFilter.addEventListener('click', () => {
		modal.classList.add('open');

		ROOT_STYLES.setProperty('--type-scroll', 'hidden');
	});

	formFilter.addEventListener('submit', (ev) => {
		ev.preventDefault();
		const data = new FormData(formFilter);

		const VALUE_TO_FILTER = {
			BLONDE_BEER: 1,
			BROWN_BEER: 2,
			RED_BEER: 3,
		};

		const valueFilter = {
			blondeBeer: Number(data.get('blonde-beer')),
			brownBeer: Number(data.get('brown-beer')),
			redbeer: Number(data.get('red-beer')),
		};

		if (
			valueFilter.blondeBeer === VALUE_TO_FILTER.BLONDE_BEER ||
			valueFilter.brownBeer === VALUE_TO_FILTER.BROWN_BEER ||
			valueFilter.redbeer === VALUE_TO_FILTER.RED_BEER
		) {
			FILTERED_PRODUCT = LIST_OF_PRODUCTS.filter(
				(product) =>
					product.filterId === valueFilter.blondeBeer ||
					product.filterId === valueFilter.brownBeer ||
					product.filterId === valueFilter.redbeer
			);

			showBeers(FILTERED_PRODUCT);
			addCart();
		} else {
			console.log('no hay por filtar');
			showBeers(products);
			addCart();
		}
	});

	const checkList = formFilter.querySelectorAll('input[type="checkbox"]');
	let numberOfFilters = 0;
	filterAmount.textContent = numberOfFilters;

	checkList.forEach((check) => {
		check.addEventListener('click', (ev) => {
			if (!ev.target.checked) {
				numberOfFilters--;
				filterAmount.textContent = numberOfFilters;
				return;
			}

			numberOfFilters++;
			filterAmount.textContent = numberOfFilters;
		});
	});

	btnClear.addEventListener('click', () => {
		checkList.forEach((check) => (check.checked = false));
	});

	btnClose.addEventListener('click', (ev) => {
		modal.classList.remove('open');
		ROOT_STYLES.setProperty('--type-scroll', 'auto');
	});

	showMenu();
	showCartModal(cartList);
});

const replaceSpace = (text) => {
	return text.split(' ').join('').toLowerCase();
};

const showMenu = () => {
	const btnMenu = DOC.getElementById('btn-menu');
	const menu = DOC.getElementById('menu');

	if (!btnMenu || !menu) return;

	btnMenu.addEventListener('click', () => {
		if (menu.classList.contains('open')) {
			menu.classList.remove('open');
		} else {
			menu.classList.add('open');
		}
	});
};

/* + cart modal */

const updateCart = (cartList) => {
	const cartModal = DOC.getElementById('cart-modal');
	const cartModalContent = DOC.getElementById('cart-modal-content');
	const cartModalAmount = cartModal.querySelector('#cart-modal-amount');
	const cartModalTotal = cartModal.querySelector('#cart-modal-total');

	if (!cartModal || !cartModalContent || !cartModalAmount || !cartModalTotal)
		return;

	cartModalAmount.textContent = cartList.length;

	const fragment = DOC.createDocumentFragment();

	cartModalContent.textContent = '';

	cartList.forEach((prod) => {
		const cartModalItem = DOC.createElement('div');
		const cartModalTitle = DOC.createElement('p');
		const cartModalPrice = DOC.createElement('p');

		cartModalTitle.textContent = prod.name;
		cartModalPrice.textContent = formatMoney(prod.price);
		cartModalItem.append(cartModalTitle, cartModalPrice);

		cartModalItem.classList.add('cart-modal__item');
		cartModalTitle.classList.add('cart-modal__title');
		cartModalPrice.classList.add('cart-modal__price');

		fragment.appendChild(cartModalItem);
	});

	cartModalContent.append(fragment);

	const totalToPay = cartList.reduce((acu, p) => acu + p.price, 0);

	cartModalTotal.textContent = formatMoney(totalToPay);
};

const showCartModal = (cartList) => {
	const cartModal = DOC.getElementById('cart-modal');
	const btnCart = DOC.getElementById('cart');

	btnCart.addEventListener('click', () => {
		console.log('clic');
		if (cartModal.classList.contains('open'))
			cartModal.classList.remove('open');
		else cartModal.classList.add('open');
	});
};

const formatMoney = (total) => {
	return `$${(total / 100 / 10).toFixed(3)}`;
};
