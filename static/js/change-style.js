document.addEventListener("DOMContentLoaded", function() {
    const toggleSettingsCheckbox = document.getElementById("toggle-settings");
    const styleSettingsDiv = document.getElementById("style-settings");
    const fontSizeSelect = document.getElementById("font-size");
    const textColorInput = document.getElementById("text-color");
    const backgroundColorInput = document.getElementById("background-color");

    const images = document.querySelectorAll('.stat-image'); // Все изображения с классом .stat-image

    // Сохраняем текущие размеры изображений, с которыми они были выведены на страницу
    images.forEach(image => {
        // Получаем текущие размеры изображения с учетом применённых стилей
        image.setAttribute('data-original-width', image.offsetWidth);
        image.setAttribute('data-original-height', image.offsetHeight);
    });

    // Обработчик для отображения/скрытия элементов управления стилями
    toggleSettingsCheckbox.addEventListener("change", function() {
        if (toggleSettingsCheckbox.checked) {
            styleSettingsDiv.style.display = "block";
        } else {
            styleSettingsDiv.style.display = "none";
        }
    });

    // Обработчик для изменения размера шрифта
    fontSizeSelect.addEventListener("change", function() {
        document.body.style.fontSize = fontSizeSelect.value;
        images.forEach(image => {
            const originalWidth = image.getAttribute('data-original-width');
            const originalHeight = image.getAttribute('data-original-height');
            // Устанавливаем исходные размеры
            image.style.width = `${originalWidth}px`;
            image.style.height = `${originalHeight}px`;
        });
    });

    // Обработчик для изменения цвета текста
    textColorInput.addEventListener("input", function() {
        document.body.style.color = textColorInput.value;
        const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6"); // Все заголовки
        headings.forEach(heading => {
            heading.style.color = textColorInput.value;
        });
        const labels = document.querySelectorAll("label"); // Все <label> элементы
        labels.forEach(label => {
            label.style.color = textColorInput.value;
        });
        const links = document.querySelectorAll("a"); // Все <a> элементы (ссылки)
        links.forEach(link => {
            link.style.color = textColorInput.value;
        });
    });

    // Обработчик для изменения цвета фона
    backgroundColorInput.addEventListener("input", function() {
        document.body.style.backgroundColor = backgroundColorInput.value;
    });
});