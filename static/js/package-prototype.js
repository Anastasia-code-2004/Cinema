// Базовый класс Package
function Package(sender, recipient, weight, sendDate) { // конструктором становится любая функция, вызванная через new
    this.sender = sender;
    this.recipient = recipient;
    this.weight = weight;
    this.sendDate = sendDate;
    // в результате получаем объект
}

// Прототип конструктора — это объект, к которому привязаны общие методы
// для всех экземпляров, созданных через этот конструктор.

// Геттеры и сеттеры
Package.prototype.getSender = function() {
    return this.sender;
};

Package.prototype.setSender = function(sender) {
    this.sender = sender;
};

Package.prototype.getRecipient = function() {
    return this.recipient;
};

Package.prototype.setRecipient = function(recipient) {
    this.recipient = recipient;
};

Package.prototype.getWeight = function() {
    return this.weight;
};

Package.prototype.setWeight = function(weight) {
    this.weight = weight;
};

Package.prototype.getSendDate = function() {
    return this.sendDate;
};

Package.prototype.setSendDate = function(sendDate) {
    this.sendDate = sendDate;
};

// Метод для добавления посылки
Package.prototype.addPackage = function(sender, recipient, weight, sendDate) {
    return new Package(sender, recipient, weight, sendDate);
};

// Метод для вывода всех посылок
Package.prototype.displayPackages = function(packages) {
    const list = document.getElementById('packageList');
    list.innerHTML = ''; // Очищаем текущий список
    packages.forEach(pkg => {
        const packageItem = document.createElement('div');
        packageItem.className = 'package-item';
        packageItem.innerHTML = `Отправитель: ${pkg.getSender()}, Получатель: ${pkg.getRecipient()}, 
        Вес: ${pkg.getWeight()} кг, 
        Дата отправления: ${pkg.getSendDate()},
        Дата получения: ${pkg.getReceivedDate()}`;
        list.appendChild(packageItem);
    });
};

function AdvancedPackage(sender, recipient, weight, sendDate, receivedDate) {
    // Вызов конструктора базового класса
    Package.call(this, sender, recipient, weight, sendDate);
    // Устанавливаем receivedDate
    this.receivedDate = receivedDate;
}

// Наследование прототипа
AdvancedPackage.prototype = Object.create(Package.prototype); // наследуемся от Package
AdvancedPackage.prototype.constructor = AdvancedPackage; // чтобы не потерялась связь со своим собственным конструктором

// Геттер для даты получения
AdvancedPackage.prototype.getReceivedDate = function() {
    return this.receivedDate;
};

// Сеттер для даты получения (если нужно)
AdvancedPackage.prototype.setReceivedDate = function(receivedDate) {
    this.receivedDate = receivedDate;
};

AdvancedPackage.prototype.addPackageFromForm = function(packagesArray) {
    // Получаем элементы формы
    const senderInput = document.getElementById('sender');
    const recipientInput = document.getElementById('recipient');
    const weightInput = document.getElementById('weight');
    const sendDateInput = document.getElementById('sendDate');
    const receiveDateInput = document.getElementById('receiveDate');

    // Считываем значения
    const sender = senderInput.value;
    const recipient = recipientInput.value;
    const weight = parseFloat(weightInput.value);
    const sendDate = sendDateInput.value;
    const receiveDate = receiveDateInput.value;

    // Проверяем, чтобы все поля были заполнены
    if (!sender || !recipient || isNaN(weight) || !sendDate || !receiveDate) {
        alert('Пожалуйста, заполните все поля.');
        event.preventDefault();
        return;
    }
    // Проверка на максимальный вес
    if (weight <= 0) {
        alert('Вес посылки не может превышать 1000 кг.');
        event.preventDefault(); // Предотвращаем отправку формы
        return;
    }
    if (weight > 1000) {
        alert('Вес посылки не может превышать 1000 кг.');
        event.preventDefault(); // Предотвращаем отправку формы
        return;
    }
    if (receiveDate < sendDate){
        alert('Дата получения не может быть раньше даты отправки.');
        event.preventDefault(); // Предотвращаем отправку формы
        return;
    }
    const newPackage = new AdvancedPackage(sender, recipient, weight, sendDate, receiveDate);

    // Добавляем посылку в массив
    packagesArray.push(newPackage);

    // Очищаем форму
    senderInput.value = '';
    recipientInput.value = '';
    weightInput.value = '';
    sendDateInput.value = '';
    receiveDateInput.value = '';
    alert('Посылка успешно добавлена!');
};

AdvancedPackage.prototype.displayRecentRecipients = function(packagesArray) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Месяц (от 0 до 11, где 0 - январь)
    const currentYear = currentDate.getFullYear(); // Год

    // Объект для группировки посылок по получателям
    const recipientData = {};

    // Фильтруем посылки и группируем по получателям
    packagesArray.forEach((pkg) => {
        const receivedDate = new Date(pkg.getReceivedDate());
        const receivedMonth = receivedDate.getMonth();
        const receivedYear = receivedDate.getFullYear();
        if (receivedYear === currentYear && receivedMonth === currentMonth) { // Используем дату получения
            const recipient = pkg.recipient;
            if (!recipientData[recipient]) {
                recipientData[recipient] = { count: 0, totalWeight: 0, receivedDates: [] };
            }
            recipientData[recipient].count += 1;
            recipientData[recipient].totalWeight += pkg.weight;
            recipientData[recipient].receivedDates.push(pkg.getReceivedDate()); // Добавляем дату получения
        }
    });

    // Элемент для отображения результата
    const packageList = document.getElementById('recipientList');
    packageList.innerHTML = '';

    // Флаг для проверки наличия результатов
    let hasResults = false;

    // Проходим по сгруппированным данным и выбираем получателей с несколькими посылками
    for (const recipient in recipientData) {
        if (recipientData[recipient].count > 1) {
            hasResults = true;
            const resultDiv = document.createElement('div');
            resultDiv.className = 'recipient-result';
            const receivedDates = recipientData[recipient].receivedDates.join(', '); // Формируем строку дат

            resultDiv.innerHTML = `
                <p><strong>Получатель:</strong> ${recipient}</p>
                <p><strong>Количество посылок:</strong> ${recipientData[recipient].count}</p>
                <p><strong>Общий вес посылок:</strong> ${recipientData[recipient].totalWeight.toFixed(2)} кг</p>
                <p><strong>Даты получения посылок:</strong> ${receivedDates}</p>
            `;
            packageList.appendChild(resultDiv);
        }
    }

    // Если результатов нет, выводим сообщение
    if (!hasResults) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = '<p>За последний месяц никто не получил более одной посылки.</p>';
        packageList.appendChild(noResultsDiv);
    }
};




document.addEventListener('DOMContentLoaded', function() {
    let packages = [];

    // Создаем обработчик для класса AdvancedPackage
    const advancedPackageHandler = new AdvancedPackage();

    // Получаем кнопки
    const addPackageBtn = document.getElementById('addPackageBtn');
    const displayPackagesBtn = document.getElementById('displayPackagesBtn');
    const displayRecipientsBtn = document.getElementById('displayRecipientsBtn');

    // Получаем блоки для вывода
    const packageListDiv = document.getElementById('packageList');
    const recipientListDiv = document.getElementById('recipientList');

    // По умолчанию скрываем блоки
    packageListDiv.style.display = 'none';
    recipientListDiv.style.display = 'none';

    // Добавляем посылку при нажатии на кнопку
    addPackageBtn.addEventListener('click', function() {
        advancedPackageHandler.addPackageFromForm(packages);
    });

    // Выводим все посылки на страницу с переключением видимости
    displayPackagesBtn.addEventListener('click', function() {
        // Переключаем видимость списка посылок
        if (packageListDiv.style.display === 'none') {
            advancedPackageHandler.displayPackages(packages);
            packageListDiv.style.display = 'block';
        } else {
            packageListDiv.style.display = 'none';
        }
    });

    // Анализируем получателей с несколькими посылками
    displayRecipientsBtn.addEventListener('click', function() {
        // Переключаем видимость результатов анализа
        if (recipientListDiv.style.display === 'none') {
            advancedPackageHandler.displayRecentRecipients(packages);
            recipientListDiv.style.display = 'block';
        } else {
            recipientListDiv.style.display = 'none';
        }
    });
});

