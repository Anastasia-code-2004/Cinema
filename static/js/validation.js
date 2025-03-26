document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("employee-form");

    const phoneInput = document.getElementById("employee-phone");
    const urlInput = document.getElementById("employee-url");
    const saveButton = document.getElementById("save-employee-button");

    const passwordInput1 = document.getElementById("employee-password1");
    const passwordInput2 = document.getElementById("employee-password2");
    const birthdateInput = document.getElementById("employee-birthdate");

    function showPreloader() {
        document.getElementById("preloader").style.display = "grid";
    }
    function hidePreloader() {
        document.getElementById("preloader").style.display = "none";
    }
    // Изначально делаем кнопку недоступной
    saveButton.disabled = true;

    // Селектим все обязательные поля
    const requiredInputs = Array.from(form.querySelectorAll('input[required]'));

    // Проверка номера телефона
    function validatePhoneNumber(phone) {
        const phoneRegex1 = /^(\+375)\s?(\(29\)|\(33\)|\(25\)|\(44\)|\(17\)|29|33|25|44|17)\s?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        const phoneRegex2 = /^(8\s?\(0(29|33|25|44|17)\))|(8\s?0(29|33|25|44|17))\s?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/; // скобки - это группа захвата
        return phoneRegex1.test(phone) || phoneRegex2.test(phone);
    }

    // Проверка URL
    function validateURL(url) {
        const urlRegex = /^(https?:\/\/)([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,8}(\/[a-zA-Z0-9\-]+)*(\/[a-zA-Z0-9\-]+\.(php|html))$/;
        return urlRegex.test(url);
    }

    // Отображение результата валидации
    function showValidationResult(isValid, inputElement, messageElement, errorMessage) {
        if (isValid) {
            inputElement.style.borderColor = "";
            inputElement.style.backgroundColor = "";
            messageElement.textContent = "";
        }
        else {
            inputElement.style.borderColor = "red";
            inputElement.style.backgroundColor = "#f8d7da";
            messageElement.textContent = errorMessage;
        }
    }

    // Сообщения об ошибках для телефона и URL
    const phoneMessageElement = document.createElement("div");
    phoneMessageElement.style.color = "red";
    phoneInput.insertAdjacentElement("afterend", phoneMessageElement);

    const urlMessageElement = document.createElement("div");
    urlMessageElement.style.color = "red";
    urlInput.insertAdjacentElement("afterend", urlMessageElement); // добавить прилежащий элемент

    // Проверка всех полей для активации кнопки
    function checkFormValidity() {
        const isPhoneValid = validatePhoneNumber(phoneInput.value);
        const isURLValid = validateURL(urlInput.value);

        // Проверяем, что все обязательные поля заполнены и корректны
        const allFieldsValid = requiredInputs.every(input => input.value.trim() !== "" && input.validity.valid);
        // Удаляет пробелы сначала и с конца строки
        showValidationResult(isPhoneValid, phoneInput, phoneMessageElement, "Номер не валиден");
        showValidationResult(isURLValid, urlInput, urlMessageElement, "URL не валиден");

        // Кнопка активируется только если все поля заполнены и валидны
        saveButton.disabled = !(allFieldsValid && isPhoneValid && isURLValid);
    }

    // Проверка на валидность номера телефона в режиме реального времени
    phoneInput.addEventListener("input", checkFormValidity);

    // Проверка на валидность URL в режиме реального времени
    urlInput.addEventListener("input", checkFormValidity);

    // Проверка остальных полей формы в режиме реального времени
    requiredInputs.forEach(input => {
        input.addEventListener("input", checkFormValidity);
    });

    // Функция для получения CSRF-токена из cookies
    function getCSRFToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 'csrftoken'.length + 1) === 'csrftoken=') {
                    cookieValue = decodeURIComponent(cookie.substring('csrftoken'.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Функция для генерации случайного пароля
    function generateRandomPassword(length) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    }

    // Функция для генерации даты рождения старше 18 лет
    function generateBirthdate() {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() - 18); // Текущая дата минус 18 лет
        const year = currentDate.getFullYear() - Math.floor(Math.random() * 30); // Генерация даты до 18 лет, но не старше 30 лет
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    showPreloader();
    saveButton.addEventListener("click", function(event) {
    event.preventDefault();
    passwordInput1.value = passwordInput2.value = generateRandomPassword(10); // Пароль длиной 10 символов
    birthdateInput.value = generateBirthdate();
    const formData = new FormData(form);
    formData.delete("url");
    // Логирование перед отправкой данных
    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

    // Отправка данных, асинхронный запрос
    fetch('/save_employee/', {
        method: 'POST',
        body: formData,  // Отправка как FormData
        headers: {
            'X-CSRFToken': getCSRFToken(),  // CSRF токен в заголовке, на стороне сервера сравниваются токены
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Данные успешно сохранены!");
            // Скрываем форму после добавления сотрудника
            const addEmployeeForm = document.getElementById("add-employee-form");
            addEmployeeForm.style.display = "none";
            // Очищаем форму
            document.getElementById("employee-form").reset();
            hidePreloader();
        } else {
            const errors = data.errors ? JSON.stringify(data.errors) : "Произошла ошибка при сохранении данных.";
            alert(errors);
            hidePreloader();
        }
    })
    .catch(error => {
        console.error("Ошибка при отправке данных:", error);
        alert("Произошла ошибка. Попробуйте позже.");
        hidePreloader();
    });
});
});
