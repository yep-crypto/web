let dishes = [];

const order = {
    soup: null,
    main: null,
    salat: null,
    drink: null,
    desert: null,
};

const emptyText = {
    soup: 'Не выбран',
    main: 'Не выбрано',
    salat: 'Не выбран',
    drink: 'Не выбран',
    desert: 'Не выбран',
};

const apiFieldNames = {
    soup: 'soup_id',
    main: 'main_course_id',
    salat: 'salad_id',
    drink: 'drink_id',
    desert: 'dessert_id',
};

async function initOrderPage() {
    try {
        dishes = await fetchDishes();
        restoreOrder(order, dishes);
        renderOrderDishes();
        updateOrderSummary();
    } catch (error) {
        console.error(error);
        alert('Не удалось загрузить блюда. Попробуйте обновить страницу.');
    }
}

function renderOrderDishes() {
    const grid = document.getElementById('order-dishes');
    grid.innerHTML = '';

    CATEGORIES.forEach((category) => {
        const dish = order[category];
        if (!dish) return;

        const card = createDishCard(dish, 'Удалить');

        card.querySelector('.btn-add').addEventListener('click', () => {
            order[category] = null;
            saveOrder(order);
            card.remove();
            updateOrderSummary();
        });

        grid.append(card);
    });

    updateOrderSummary();
}

function updateOrderSummary() {
    let total = 0;
    let somethingSelected = false;

    CATEGORIES.forEach((category) => {
        const dish = order[category];
        const text = document.getElementById(`order-${category}`);

        if (dish) {
            text.textContent = `${dish.name} ${dish.price}₽`;
            total += dish.price;
            somethingSelected = true;
        } else {
            text.textContent = emptyText[category];
        }
    });

    document.getElementById('order-total').textContent = `${total}₽`;
    document.getElementById('order-empty').style.display = somethingSelected ? 'none' : 'block';
}

document.querySelector('.order-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const problem = getNotificationText();
    if (problem) {
        showNotification(problem);
        return;
    }

    const form = event.target;
    const formData = new FormData(form);

    if (formData.get('delivery_type') === 'by_time' && !formData.get('delivery_time')) {
        showNotification('Укажите время доставки');
        return;
    }

    const data = {
        full_name:        formData.get('full_name'),
        email:            formData.get('email'),
        subscribe:        formData.get('subscribe') ? 1 : 0,
        phone:            formData.get('phone'),
        delivery_address: formData.get('delivery_address'),
        delivery_type:    formData.get('delivery_type'),
        comment:          formData.get('comment'),
    };

    if (data.delivery_type === 'by_time') {
        data.delivery_time = formData.get('delivery_time');
    }

    CATEGORIES.forEach((category) => {
        if (order[category]) {
            data[apiFieldNames[category]] = Number(order[category].id);
        }
    });

    try {
        const response = await fetch(ORDERS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok || result.error) {
            throw new Error(result.error || `Ошибка сервера: ${response.status}`);
        }

        clearSavedOrder();
        CATEGORIES.forEach((category) => (order[category] = null));
        form.reset();
        renderOrderDishes();

        alert('Заказ успешно оформлен!');
    } catch (error) {
        alert(`Не удалось оформить заказ: ${error.message}`);
    }
});

initOrderPage();