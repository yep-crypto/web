const order = {
    soup: null,
    main: null,
    drink: null,
};

const emptyText = {
    soup: 'Блюдо не выбрано',
    main: 'Блюдо не выбрано',
    drink: 'Напиток не выбран',
};

function updateOrder() {
    let total = 0;
    let somethingSelected = false;

    ['soup', 'main', 'drink'].forEach((category) => {
        const dish = order[category];
        const text = document.getElementById(`order-${category}`);
        const input = document.getElementById(`input-${category}`);

        if (dish) {
            text.textContent = `${dish.name} ${dish.price}₽`;
            input.value = dish.keyword;
            total += dish.price;
            somethingSelected = true;
        } else {
            text.textContent = emptyText[category];
            input.value = '';
        }
    });

    document.getElementById('order-total').textContent = `${total}₽`;

    document.getElementById('nothing-selected').style.display = somethingSelected ? 'none' : 'block';
    document.getElementById('order-details').style.display   = somethingSelected ? 'block' : 'none';
}

document.querySelectorAll('.dish-card').forEach((card) => {
    card.querySelector('.btn-add').addEventListener('click', () => {
        const dish = dishes.find((d) => d.keyword === card.dataset.dish);

        order[dish.category] = dish;

        document
            .querySelectorAll(`.dishes-grid[data-category="${dish.category}"] .dish-card`)
            .forEach((c) => {
                c.classList.remove('selected');
                c.querySelector('.btn-add').textContent = 'Добавить';
            });
        card.classList.add('selected');
        card.querySelector('.btn-add').textContent = 'Добавлено ✓';

        updateOrder();
    });
});

document.querySelector('.order-form').addEventListener('reset', () => {
    order.soup = order.main = order.drink = null;
    document.querySelectorAll('.dish-card.selected').forEach((c) => {
        c.classList.remove('selected');
        c.querySelector('.btn-add').textContent = 'Добавить';
    });
    setTimeout(updateOrder);
});

updateOrder();