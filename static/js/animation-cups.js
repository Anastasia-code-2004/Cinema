document.addEventListener('DOMContentLoaded', function () {
    const awards = document.querySelectorAll('.award'); // Получаем все кубки
    const windowHeight = window.innerHeight;

    let lastScrollPosition = 0;  // Переменная для хранения последней позиции прокрутки
    let scrollDirection = 'down'; // Начальное направление прокрутки (предположим, что прокрутка вниз)

    // Функция для вычисления видимости элемента
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= windowHeight;
    }

    // Функция для анимации кубков при скроллинге
    function animateAwards() {
        const scrollPosition = window.scrollY;

        // Определяем направление прокрутки
        if (scrollPosition > lastScrollPosition) {
            scrollDirection = 'down'; // Прокрутка вниз
        } else if (scrollPosition < lastScrollPosition) {
            scrollDirection = 'up'; // Прокрутка вверх
        }

        lastScrollPosition = scrollPosition; // Обновляем последнюю позицию прокрутки

        // Логирование направления прокрутки (для отладки)
        console.log(`Прокрутка: ${scrollDirection}`);

        awards.forEach(award => {
            if (isInViewport(award)) {
                // Элемент виден на экране
                const awardPosition = award.offsetTop;
                const distanceFromTop = awardPosition - scrollPosition;

                // Расчет вращения и масштаба в зависимости от направления прокрутки
                let rotation, scale;

                if (scrollDirection === 'down') {
                    // Прокрутка вниз - увеличиваем масштаб и ускоряем вращение
                    rotation = distanceFromTop * 0.3; // Ускоряем вращение при прокрутке вниз
                    scale = 1.1 + distanceFromTop / 1000; // Увеличиваем масштаб
                } else {
                    // Прокрутка вверх - уменьшаем масштаб и замедляем вращение
                    rotation = distanceFromTop * 0.3; // Замедляем вращение при прокрутке вверх
                    scale = 1.2 + distanceFromTop / 1500; // Немного уменьшаем масштаб
                }

                // Применяем вращение и масштаб
                award.style.transform = `rotate(${rotation - 140}deg) scale(${scale})`;

                // Устанавливаем прозрачность и другие эффекты
                award.style.opacity = 1;
            } else {
                // Элемент не виден
                award.style.opacity = 0;
                award.style.transform = 'scale(0.1) rotate(0deg)';
            }
        });
    }

    // Отслеживаем событие скроллинга
    window.addEventListener('scroll', animateAwards);

    // Запускаем функцию при первой загрузке страницы
    animateAwards();
});
