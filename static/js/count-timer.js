document.addEventListener("DOMContentLoaded", () => {
    const timerElement = document.getElementById('countdown-timer');
    const countdownDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    const now = Date.now();

    // Check if the timer start time exists in localStorage
    let timerStart = localStorage.getItem('timerStart');

    if (!timerStart) {
        // If no timerStart found, set it to the current time and save it in localStorage
        timerStart = now;
        localStorage.setItem('timerStart', timerStart);
    }

    const endTime = parseInt(timerStart) + countdownDuration;

    function updateCountdown() {
        const timeLeft = endTime - Date.now();

        if (timeLeft <= 0) {
            timerElement.textContent = "Время истекло!";
            clearInterval(interval); // очищаем интервал, то есть заканчивааем бесконечный цикл обновления времени
            localStorage.removeItem('timerStart'); // Optionally reset timer after countdown ends
        } else {
            const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
            const seconds = Math.floor((timeLeft / 1000) % 60);

            timerElement.textContent = `${hours}ч ${minutes}м ${seconds}с`;
        }
    }

    // Update countdown every second
    const interval = setInterval(updateCountdown, 1000); // сохраняем индефикатор интервала в переменной interval
    updateCountdown();
});
