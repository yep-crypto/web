function getNotificationText() {
    const soup   = order.soup;
    const main   = order.main;
    const salat  = order.salat;
    const drink  = order.drink;
    const desert = order.desert;

    if (!soup && !main && !salat && !drink && !desert) {
        return 'Ничего не выбрано. Выберите блюда для заказа';
    }
    if (soup && !main && !salat) {
        return 'Выберите главное блюдо/салат/стартер';
    }
    if (salat && !soup && !main) {
        return 'Выберите суп или главное блюдо';
    }
    if (!soup && !main && !salat) {
        return 'Выберите главное блюдо';
    }
    if (!drink) {
        return 'Выберите напиток';
    }
    return null;
}

function showNotification(text) {
    const old = document.querySelector('.notification');
    if (old) {
        old.remove();
    }

    const box = document.createElement('div');
    box.classList.add('notification');

    const message = document.createElement('p');
    message.textContent = text;

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('notification-btn');
    button.textContent = 'Окей 👌';

    button.addEventListener('click', () => {
        box.remove();
    });

    box.append(message, button);
    document.body.append(box);
}

document.querySelector('.order-form').addEventListener('submit', (event) => {
    const text = getNotificationText();

    if (text) {
        event.preventDefault();
        showNotification(text);
    }
});