document.addEventListener('DOMContentLoaded', function () {
    const theater = theaterJS();

    theater
        .on('type:start, erase:start', function () {
            theater.getCurrentActor().$element.classList.add('actor__content--typing');
        })
        .on('type:end, erase:end', function () {
            theater.getCurrentActor().$element.classList.remove('actor__content--typing');
        });

    theater
        .addActor('cashier', { speed: 0.9, accuracy: 0.8 })
        .addActor('viewer', { speed: 0.9, accuracy: 0.8 })
        .addScene('viewer:Что сегодня?', 500)
        .addScene('cashier:Есть новинки и классика.', 500)
        .addScene('viewer:Хочу что-то необычное.', 500)
        .addScene('cashier:Тогда выберите "Интерстеллар".', 600)
        .addScene('viewer:Беру!', 500)
        .addScene('cashier:Отличный выбор!', 600)
        .addScene(theater.replay.bind(theater));
});
