class Package {
    constructor(sender, recipient, weight, sendDate) {
        this.sender = sender;        // Отправитель
        this.recipient = recipient;  // Получатель
        this.weight = weight;        // Вес посылки
        this.sendDate = sendDate;    // Дата отправки
    }

    // Геттеры
    get sender() {
        return this._sender;
    }

    get recipient() {
        return this._recipient;
    }

    get weight() {
        return this._weight;
    }

    get sendDate() {
        return this._sendDate;
    }

    // Сеттеры
    set sender(newSender) {
        if (newSender.trim() !== '') {
            this._sender = newSender;
        } else {
            throw new Error("Имя отправителя не может быть пустым.");
        }
    }

    set recipient(newRecipient) {
        if (newRecipient.trim() !== '') {
            this._recipient = newRecipient;
        } else {
            throw new Error("Имя получателя не может быть пустым.");
        }
    }

    set weight(newWeight) {
        if (newWeight > 0 && newWeight <= 1000) {
            this._weight = newWeight;
        } else {
            if (newWeight <= 0)
                throw new Error("Вес должен быть положительным числом.");
            if (newWeight > 100)
                throw new Error("Максимальный вес 1000 кг.");
        }
    }

    set sendDate(newSendDate) {
        this._sendDate = newSendDate;
    }

    static displayPackages(packages){
        const list = document.getElementById('packageList');
            list.innerHTML = ''; // Очищаем текущий список
            packages.forEach(pkg => {
            const packageItem = document.createElement('div');
            packageItem.className = 'package-item';
            packageItem.innerHTML = `Отправитель: ${pkg.sender}, Получатель: ${pkg.recipient}, 
            Вес: ${pkg.weight} кг, 
            Дата отправления: ${pkg.sendDate},
            Дата получения: ${pkg.receiveDate}`;
            list.appendChild(packageItem);
        });
    }
}

class AdvancedPackage extends Package {
    constructor(sender, recipient, weight, sendDate, receiveDate) {
        super(sender, recipient, weight, sendDate);
        this.receiveDate = receiveDate; // Дата получения, здесь вызываем сеттер, то есть не обращаемся к свойству напрямую
    }

    // Геттеры
    get receiveDate() {
        return this._receiveDate;
    }

    // Сеттер с проверкой
    set receiveDate(newReceiveDate) {
        if (newReceiveDate < this._sendDate) {
            throw new Error("Дата получения не может быть раньше даты отправления.");
        }
        this._receiveDate = newReceiveDate;
    }

    static addPackageFromForm(packages){
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

        // Создаем новый объект посылки
        try {
            const newPackage = new AdvancedPackage(sender, recipient, weight, sendDate, receiveDate);
            packages.push(newPackage);
            // Очищаем форму
            senderInput.value = '';
            recipientInput.value = '';
            weightInput.value = '';
            sendDateInput.value = '';
            receiveDateInput.value = '';
            alert('Посылка успешно добавлена!');
        }
        catch (error){
            alert(`Ошибка при добавлении посылки. ${error.message}`);
        }

    }

    static displayRecentRecipients(packagesArray){
        // Устанавливаем дату для фильтрации за последний месяц
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // Месяц (от 0 до 11, где 0 - январь)
        const currentYear = currentDate.getFullYear(); // Год

        // Объект для группировки посылок по получателям
        const recipientData = {};

        // Фильтруем посылки и группируем по получателям
        packagesArray.forEach((pkg) => {
            const receivedDate = new Date(pkg.receiveDate);
            const receivedMonth = receivedDate.getMonth();
            const receivedYear = receivedDate.getFullYear();
            if (receivedYear === currentYear && receivedMonth === currentMonth) { // Используем дату получения
                const recipient = pkg.recipient;
                if (!recipientData[recipient]) {
                    recipientData[recipient] = { count: 0, totalWeight: 0, receivedDates: [] };
                }
                recipientData[recipient].count += 1;
                recipientData[recipient].totalWeight += pkg.weight;
                recipientData[recipient].receivedDates.push(pkg.receiveDate); // Добавляем дату получения
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
    }
}


document.addEventListener('DOMContentLoaded', function() {
    let packages = []; // Массив для хранения посылок

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
        // Вызов статического метода добавления посылки
        AdvancedPackage.addPackageFromForm(packages);
    });

    // Выводим все посылки на страницу с переключением видимости
    displayPackagesBtn.addEventListener('click', function() {
        // Переключаем видимость списка посылок
        if (packageListDiv.style.display === 'none') {
            // Вызов статического метода отображения всех посылок
            AdvancedPackage.displayPackages(packages);
            packageListDiv.style.display = 'block';
        } else {
            packageListDiv.style.display = 'none';
        }
    });

    // Анализируем получателей с несколькими посылками
    displayRecipientsBtn.addEventListener('click', function() {
        // Переключаем видимость результатов анализа
        if (recipientListDiv.style.display === 'none') {
            // Вызов статического метода для отображения получателей с несколькими посылками
            AdvancedPackage.displayRecentRecipients(packages);
            recipientListDiv.style.display = 'block';
        } else {
            recipientListDiv.style.display = 'none';
        }
    });
});
