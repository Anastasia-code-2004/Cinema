// Глобальные переменные
let rows = [], filteredRows = [], currentPage = 1;
let lastSelectedEmployee = null; // Флаг для отслеживания последнего выбранного сотрудника
const rowsPerPage = 3;

// Функция для отображения прелоадера
function showPreloader() {
    const preloader = document.getElementById("preloader");
    preloader.style.display = "grid";
}

// Функция для скрытия прелоадера
function hidePreloader() {
    const preloader = document.getElementById("preloader");
    preloader.style.display = "none";
}

function sortTable(columnIndex) {
    showPreloader();
    const table = document.getElementById("employee-table");
    let isAscending = table.getAttribute("data-sort-dir") === "asc";

    // Переключаем направление сортировки
    isAscending = !isAscending;
    table.setAttribute("data-sort-dir", isAscending ? "asc" : "desc");

    // Сопоставление индекса столбца с соответствующим свойством данных
    const columnMap = ["checkbox", "photo", "username", "job_description", "phone", "email"];
    const sortField = columnMap[columnIndex];

    // Сортировка массива данных
    const rowsToSort = filteredRows.length > 0 ? filteredRows : rows;
    rowsToSort.sort((a, b) => { // берутся два элемента из массива и сравниваются
        const aText = (a[sortField] || "").toString().toLowerCase();
        const bText = (b[sortField] || "").toString().toLowerCase();
        return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText); // возвращает - 1, 0 или 1
    });

    // Обновляем таблицу с отсортированными данными
    updateTable(rowsToSort);

    // Обновление индикатора сортировки
    document.querySelectorAll("th .sort-indicator").forEach(indicator => {
        indicator.textContent = "⇅";
    });
    const currentIndicator = table.querySelectorAll("th")[columnIndex].querySelector(".sort-indicator");
    currentIndicator.textContent = isAscending ? "↑" : "↓";

    // Перерисовываем пагинацию
    currentPage = 1;
    displayPage(currentPage);
    updatePaginationControls();
    hidePreloader();
}

function updateTable(rowsData) {
    const tableBody = document.getElementById("employee-tbody");
    tableBody.innerHTML = "";  // Очищаем таблицу

    rowsData.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="employee-checkbox" data-username="${employee.username}"></td>
            <td><img src="${employee.photo}" alt="Фото ${employee.username}" style="height: 50px; width: auto;"></td>
            <td>${employee.username}</td>
            <td>${employee.job_description}</td>
            <td>${employee.phone}</td>
            <td>${employee.email}</td>
        `;
        row.addEventListener("click", () => showEmployeeDetails(employee));
        tableBody.appendChild(row);
    });
}


// Функция для отображения определенной страницы
function displayPage(page) {
    const rowsToDisplay = filteredRows.length > 0 ? filteredRows : rows;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const tableBody = document.getElementById("employee-tbody");
    tableBody.innerHTML = ""; // Очищаем таблицу

    // Отображаем строки только для текущей страницы
    rowsToDisplay.slice(start, end).forEach(employee => {
        // Создаем элемент <tr> для каждой строки данных
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input style="justify-content: center" type="checkbox" class="employee-checkbox" data-username="${employee.username}"></td>
            <td><img src="${employee.photo}" alt="Фото ${employee.username}" style="height: 50px; width: auto;"></td>
            <td>${employee.username}</td>
            <td>${employee.job_description}</td>
            <td>${employee.phone}</td>
            <td>${employee.email}</td>
        `;
        row.addEventListener("click", () => showEmployeeDetails(employee));
        tableBody.appendChild(row);
    });

    updatePaginationControls();
}

// Функция для обновления кнопок пагинации
function updatePaginationControls() {
    const rowsToPaginate = filteredRows.length > 0 ? filteredRows : rows;
    const paginationControls = document.getElementById("pagination-controls");
    paginationControls.innerHTML = ""; // Очищаем предыдущие элементы управления

    const totalPages = Math.ceil(rowsToPaginate.length / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("pagination-button");
        if (i === currentPage) button.classList.add("active");
        button.addEventListener("click", () => {
            currentPage = i;
            displayPage(currentPage);
        });
        paginationControls.appendChild(button);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Функция для фильтрации строк таблицы
async function filterTable() {
    showPreloader();
    const searchTerm = document.getElementById("search-input").value.toLowerCase();

    // Фильтрация массива данных
    filteredRows = rows.filter(employee => {
        const rowText = `${employee.username} ${employee.job_description} ${employee.phone} ${employee.email}`.toLowerCase();
        return rowText.includes(searchTerm);
    });

    await delay(3000);

    // Если отфильтрированных данных нет
    if (filteredRows.length === 0) {
        document.getElementById("employee-tbody").innerHTML = "";
        document.getElementById("pagination-controls").innerHTML = "";
    } else {
        // Обновляем таблицу и пагинацию
        currentPage = 1;
        displayPage(currentPage);
        updatePaginationControls();
    }
    hidePreloader();
}

function showEmployeeDetails(employee) {
    showPreloader();
    const detailsBlock = document.getElementById("employee-details");

    // Если выбран тот же сотрудник, скрываем блок
    if (lastSelectedEmployee === employee) {
        detailsBlock.style.display = "none";
        lastSelectedEmployee = null;  // Сбрасываем флаг
        return;
    }

    // Заполняем поля блока данными из выбранной строки
    document.getElementById("detail-photo").src = employee.photo;
    document.getElementById("detail-name").textContent = employee.username;
    document.getElementById("detail-description").textContent = employee.job_description;
    document.getElementById("detail-phone").textContent = employee.phone;
    document.getElementById("detail-email").textContent = employee.email;
    document.getElementById("reward-button").addEventListener("click", () => {
        const selectedEmployees = [];
        document.querySelectorAll(".employee-checkbox:checked").forEach(checkbox => {
            selectedEmployees.push(checkbox.getAttribute("data-username"));
        });

        if (selectedEmployees.length > 0) {
            document.getElementById("reward-text").textContent = `Премированы сотрудники: ${selectedEmployees.join(", ")}`;
        } else {
            document.getElementById("reward-text").textContent = "Нет выбранных сотрудников для премирования.";
        }
    });
    // Отображаем блок с деталями
    detailsBlock.style.display = "block";

    // Обновляем флаг
    lastSelectedEmployee = employee;
    hidePreloader();
}

// Начальная инициализация
document.addEventListener("DOMContentLoaded", () => {
    showPreloader();
    // Запрашиваем данные с сервера
    fetch('/employee_list/') // асинхронный запрос на сервер
        .then(response => response.json()) // преобразование ответа в json
        .then(data => {
            // Сохраняем данные сотрудников в переменную
            rows = data.employees;

            // Сначала обновляем таблицу
            updateTable(rows);

            // Добавляем обработчик для фильтрации
            document.getElementById("search-button").addEventListener("click", filterTable);

            // Добавляем обработчики для сортировки
            const headers = document.querySelectorAll("#employee-table th");
            headers.forEach((header, index) => {
                if (index > 1 && header.querySelector(".sort-indicator")) {  // Игнорируем первый столбец
                    header.addEventListener("click", () => sortTable(index)); // index - 1 для columnMap
                }
            });
            updatePaginationControls();
            displayPage(currentPage);
            hidePreloader();
        })
        .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
                hidePreloader();
            }
        );
    const addEmployeeButton = document.getElementById("add-employee-button");
    const addEmployeeForm = document.getElementById("add-employee-form");
    const cancelEmployeeButton = document.getElementById("cancel-employee-button");

    // Открытие формы
    addEmployeeButton.addEventListener("click", function () {
        addEmployeeForm.style.display = "block";
    });

    // Закрытие формы без сохранения
    cancelEmployeeButton.addEventListener("click", function () {
        addEmployeeForm.style.display = "none";
    });
});

