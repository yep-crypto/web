function displayDishes() {
    dishes.sort((a, b) => a.name.localeCompare(b.name));

    dishes.forEach((dish) => {
        const grid = document.querySelector(`.dishes-grid[data-category="${dish.category}"]`);

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

displayDishes();