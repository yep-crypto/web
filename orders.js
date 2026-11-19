let dishes = [];
let orders = [];
let currentOrder = null;

const dishFields = [
    { field: 'soup_id',        title: 'Суп' },
    { field: 'main_course_id', title: 'Основное блюдо' },
    { field: 'salad_id',       title: 'Салат/стартер' },
    { field: 'drink_id',       title: 'Напиток' },
    { field: 'dessert_id',     title: 'Десерт' },
];

async function request(url, options = {}) {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok || result.error) {
        throw new Error(result.error || `Ошибка сервера: ${response.status}`);
    }
    return result;
}

function findDish(id) {
    return dishes.find((d) => String(d.id) === String(id));
}


function getOrderDishes(order) {
    const result = [];
    dishFields.forEach(({ field, title }) => {
        const dish = findDish(order[field]);
        if (order[field] && dish) {
            result.push({ title, dish });
        }
    });
    return result;
}

function getOrderTotal(order) {
    let total = 0;
    getOrderDishes(order).forEach(({ dish }) => {
        total += dish.price;
    });
    return total;
}

function parseDate(value) {
    return new Date(String(value).replace(' ', 'T'));
}

function formatDate(value) {
    const date = parseDate(value);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} `
        + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getDeliveryText(order) {
    if (order.delivery_type === 'by_time' && order.delivery_time) {
        return order.delivery_time.slice(0, 5);
    }
    return 'Как можно скорее (с 07:00 до 23:00)';
}




async function initOrdersPage() {
    try {
        dishes = await fetchDishes();
        await loadOrders();
    } catch (error) {
        showNotification(`Не удалось загрузить заказы: ${error.message}`);
    }
}

async function loadOrders() {
    orders = await request(ORDERS_URL);
    orders.sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at));
    renderOrders();
}

function renderOrders() {
    const tbody = document.getElementById('orders-body');
    tbody.innerHTML = '';

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="orders-empty">Заказов пока нет</td></tr>';
        return;
    }

    orders.forEach((order, index) => {
        const dishNames = getOrderDishes(order).map(({ dish }) => dish.name).join(', ');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${formatDate(order.created_at)}</td>
            <td class="orders-dishes">${dishNames}</td>
            <td>${getOrderTotal(order)}₽</td>
            <td>${getDeliveryText(order)}</td>
            <td class="orders-actions">
                <button type="button" class="icon-btn" data-action="view" title="Подробнее">
                    <i class="bi bi-eye"></i>
                </button>
                <button type="button" class="icon-btn" data-action="edit" title="Редактировать">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="icon-btn" data-action="delete" title="Удалить">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        row.querySelector('[data-action="view"]').addEventListener('click', () => openViewModal(order));
        row.querySelector('[data-action="edit"]').addEventListener('click', () => openEditModal(order));
        row.querySelector('[data-action="delete"]').addEventListener('click', () => openDeleteModal(order));

        tbody.append(row);
    });
}


function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}


document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => {
        button.closest('.dialog').classList.remove('open');
    });
});


function renderDishList(container, order) {
    container.innerHTML = '';
    getOrderDishes(order).forEach(({ title, dish }) => {
        const row = document.createElement('div');
        row.classList.add('info-row');
        row.innerHTML = `<span>${title}</span><span>${dish.name} (${dish.price}₽)</span>`;
        container.append(row);
    });
}


function openViewModal(order) {
    document.getElementById('view-date').textContent    = formatDate(order.created_at);
    document.getElementById('view-name').textContent    = order.full_name;
    document.getElementById('view-address').textContent = order.delivery_address;
    document.getElementById('view-time').textContent    = getDeliveryText(order);
    document.getElementById('view-phone').textContent   = order.phone;
    document.getElementById('view-email').textContent   = order.email;
    document.getElementById('view-comment').textContent = order.comment || 'Нет комментария';
    document.getElementById('view-total').textContent   = `${getOrderTotal(order)}₽`;

    renderDishList(document.getElementById('view-dishes'), order);
    openModal('view-modal');
}


const editForm = document.getElementById('edit-form');

function openEditModal(order) {
    currentOrder = order;

    document.getElementById('edit-date').textContent  = formatDate(order.created_at);
    document.getElementById('edit-total').textContent = `${getOrderTotal(order)}₽`;
    renderDishList(document.getElementById('edit-dishes'), order);

    editForm.elements.full_name.value        = order.full_name || '';
    editForm.elements.delivery_address.value = order.delivery_address || '';
    editForm.elements.delivery_type.value    = order.delivery_type || 'now';
    editForm.elements.delivery_time.value    = (order.delivery_time || '').slice(0, 5);
    editForm.elements.phone.value            = order.phone || '';
    editForm.elements.email.value            = order.email || '';
    editForm.elements.comment.value          = order.comment || '';

    openModal('edit-modal');
}

editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(editForm);

    if (formData.get('delivery_type') === 'by_time' && !formData.get('delivery_time')) {
        showNotification('Укажите время доставки');
        return;
    }

    const data = {
        full_name:        formData.get('full_name'),
        email:            formData.get('email'),
        phone:            formData.get('phone'),
        delivery_address: formData.get('delivery_address'),
        delivery_type:    formData.get('delivery_type'),
        delivery_time:    formData.get('delivery_type') === 'by_time' ? formData.get('delivery_time') : null,
        comment:          formData.get('comment'),
    };

    try {
        await request(`${ORDERS_URL}/${currentOrder.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        closeModal('edit-modal');
        showNotification('Заказ успешно изменён');
        await loadOrders();
    } catch (error) {
        showNotification(`Не удалось изменить заказ: ${error.message}`);
    }
});


function openDeleteModal(order) {
    currentOrder = order;
    openModal('delete-modal');
}

document.getElementById('delete-confirm').addEventListener('click', async () => {
    try {
        await request(`${ORDERS_URL}/${currentOrder.id}`, { method: 'DELETE' });

        closeModal('delete-modal');
        showNotification('Заказ успешно удалён');
        await loadOrders();
    } catch (error) {
        showNotification(`Не удалось удалить заказ: ${error.message}`);
    }
});


initOrdersPage();