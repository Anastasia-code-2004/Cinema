document.addEventListener('DOMContentLoaded', function () {
    // Функция для расчета возраста и дня недели
    function calculateAgeAndDayOfWeek() {
        const day = document.getElementById('id_date_of_birth_day').value;
        const month = document.getElementById('id_date_of_birth_month').value;
        const year = document.getElementById('id_date_of_birth_year').value;

        if (!day || !month || !year) return; // Если день, месяц или год не выбраны, не делаем расчет

        const dob = new Date(`${year}-${month}-${day}`); // Создаем дату из выбранных значений
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--; // Уменьшаем возраст, если день рождения еще не был в этом году
        }

        // Вычисление дня недели
        const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
        const dayOfWeek = daysOfWeek[dob.getDay()];

        // Выводим результаты
        const ageMessage = document.getElementById('age-message');
        const dayMessage = document.getElementById('day-message');
        const ageInfo = document.getElementById('age-info');

        ageMessage.textContent = `Ваш возраст: ${age} лет`;
        dayMessage.textContent = `Вы родились в: ${dayOfWeek}`;

        // Проверка на совершеннолетие
        if (age < 18) {
            alert("Вы несовершеннолетний. Необходимо разрешение родителей для использования сайта.");
        }

        // Показываем информацию
        ageInfo.style.display = 'block';
    }

    // Добавляем обработчики событий для отслеживания изменений в каждом из select
    document.getElementById('id_date_of_birth_day').addEventListener('change', calculateAgeAndDayOfWeek);
    document.getElementById('id_date_of_birth_month').addEventListener('change', calculateAgeAndDayOfWeek);
    document.getElementById('id_date_of_birth_year').addEventListener('change', calculateAgeAndDayOfWeek);
});
