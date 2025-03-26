document.addEventListener('DOMContentLoaded', function() {
    const schedules = document.querySelectorAll('.schedule-section');
    const itemsPerPage = 1;  // Количество элементов на странице
    const totalPages = Math.ceil(schedules.length / itemsPerPage);  // Общее количество страниц

    let currentPage = 1;  // Начинаем с первой страницы

    // Функция для отображения расписания
    function showPage(page) {
        // Скрыть все элементы
        schedules.forEach((schedule, index) => {
            schedule.style.display = 'none';
        });

        // Показываем только те элементы, которые соответствуют текущей странице
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        for (let i = startIndex; i < endIndex && i < schedules.length; i++) {
            schedules[i].style.display = 'block';
        }

        // Обновление контролов пагинации
        updatePaginationControls();
    }

    // Функция для обновления контролов пагинации
    function updatePaginationControls() {
        const paginationControls = document.getElementById('pagination-controls');
        paginationControls.innerHTML = '';  // Очищаем старые кнопки

        // Создаем кнопки с номерами страниц
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page-button');
            if (i === currentPage) {
                pageButton.classList.add('active');  // Добавляем активный класс для текущей страницы
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                showPage(currentPage);
            });
            paginationControls.appendChild(pageButton);
        }
    }

    // Изначально показываем первую страницу
    showPage(currentPage);
});
