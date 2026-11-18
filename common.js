const API_URL    = 'https://6afdc50b2a9c141d36b902a9.mockapi.io/api/v1';
const DISHES_URL = `${API_URL}/dishes`;
const ORDERS_URL = `${API_URL}/orders`;

const STORAGE_KEY = 'food-order';
const CATEGORIES  = ['soup', 'main', 'salat', 'drink', 'desert'];

async function fetchDishes() {
    const response = await fetch(DISHES_URL);
    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
    }
    return response.json();
}

function getSavedOrder() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

function saveOrder(order) {
    const ids = {};
    CATEGORIES.forEach((category) => {
        if (order[category]) {
            ids[category] = order[category].id;
        }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function clearSavedOrder() {
    localStorage.removeItem(STORAGE_KEY);
}

function restoreOrder(order, dishes) {
    const ids = getSavedOrder();
    CATEGORIES.forEach((category) => {
        order[category] = dishes.find((d) => String(d.id) === String(ids[category])) || null;
    });
}

function createDishCard(dish, buttonText) {
    const card = document.createElement('div');
    card.classList.add('dish-card');
    card.dataset.id = dish.id;
    card.dataset.category = dish.category;
    card.dataset.kind = dish.kind;

    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" class="dish-image">
        <p class="dish-price">${dish.price}₽</p>
        <p class="dish-name">${dish.name}</p>
        <p class="dish-weight">${dish.count}</p>
        <button type="button" class="btn-add">${buttonText}</button>
    `;
    return card;
}