const order = {
    soup: null,
    main: null,
    salat: null,
    drink: null,
    desert: null,
};

function markSelectedCards() {
    document.querySelectorAll('.dish-card').forEach((card) => {
        const chosen = order[card.dataset.category];
        const isSelected = chosen && String(chosen.id) === card.dataset.id;

        card.classList.toggle('selected', isSelected);
        card.querySelector('.btn-add').textContent = isSelected ? 'Добавлено ✓' : 'Добавить';
    });
}

function updatePanel() {
    let total = 0;
    let somethingSelected = false;

    CATEGORIES.forEach((category) => {
        if (order[category]) {
            total += order[category].price;
            somethingSelected = true;
        }
    });

    document.getElementById('panel-total').textContent = `${total}₽`;
    document.getElementById('checkout-panel').style.display = somethingSelected ? '' : 'none';

    const isValidCombo = getNotificationText() === null;
    document.getElementById('checkout-link').classList.toggle('disabled', !isValidCombo);
}

function initOrderButtons() {
    document.querySelectorAll('.dish-card').forEach((card) => {
        card.querySelector('.btn-add').addEventListener('click', () => {
            const dish = dishes.find((d) => String(d.id) === card.dataset.id);

            order[dish.category] = dish;
            saveOrder(order);
            markSelectedCards();
            updatePanel();
        });
    });
}

document.getElementById('checkout-link').addEventListener('click', (event) => {
    if (event.currentTarget.classList.contains('disabled')) {
        event.preventDefault();
        showNotification(getNotificationText());
    }
});