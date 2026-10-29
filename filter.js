document.querySelectorAll('.category-section').forEach((section) => {
    const buttons = section.querySelectorAll('.filter-btn');
    const cards = section.querySelectorAll('.dish-card');

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const wasActive = btn.classList.contains('active');
            buttons.forEach((b) => b.classList.remove('active'));

            if (wasActive) {
                cards.forEach((c) => (c.style.display = ''));      // повторный клик — показать всё
            } else {
                btn.classList.add('active');
                cards.forEach((c) => {
                    c.style.display = c.dataset.kind === btn.dataset.kind ? '' : 'none';
                });
            }
        });
    });
});