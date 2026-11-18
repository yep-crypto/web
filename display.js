const API_URL = 'https://6afdc50b2a9c141d36b902a9.mockapi.io/api/v1/dishes';

let dishes = [];

async function loadDishes() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        dishes = data.map((dish) => ({
            ...dish,
            category: dish.category,
        }));

        displayDishes();
        initOrderButtons();
        initFilters();
    } catch (error) {
        console.error('Не удалось загрузить блюда:', error);
    }
}

function displayDishes() {
    dishes.sort((a, b) => a.name.localeCompare(b.name));

    dishes.forEach((dish) => {
        const grid = document.querySelector(`.dishes-grid[data-category="${dish.category}"]`);
        if (!grid) return;

        const card = document.createElement('div');
        card.classList.add('dish-card');
        card.dataset.dish = dish.keyword;
        card.dataset.kind = dish.kind;

        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" class="dish-image">
            <p class="dish-price">${dish.price}₽</p>
            <p class="dish-name">${dish.name}</p>
            <p class="dish-weight">${dish.count}</p>
            <button type="button" class="btn-add">Добавить</button>
        `;

        grid.append(card);
    });
}

loadDishes();