let dishes = [];

async function initLunchPage() {
    try {
        dishes = await fetchDishes();

        displayDishes();
        initOrderButtons();
        initFilters();

        restoreOrder(order, dishes);   // достаём выбор из localStorage
        markSelectedCards();           // подсвечиваем выбранное
        updatePanel();                 // считаем стоимость
    } catch (error) {
        console.error('Не удалось загрузить блюда:', error);
    }
}

function displayDishes() {
    dishes.sort((a, b) => a.name.localeCompare(b.name));

    dishes.forEach((dish) => {
        const grid = document.querySelector(`.dishes-grid[data-category="${dish.category}"]`);
        if (grid) {
            grid.append(createDishCard(dish, 'Добавить'));
        }
    });
}

initLunchPage();
