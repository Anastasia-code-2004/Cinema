document.addEventListener('DOMContentLoaded', function () {
    // Инициализация карты
    window.initMap = function () {
        const cinemaLocation = { lat: 52.707646, lng: 25.358686 };

        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: cinemaLocation,
        });

        // Добавление маркера для кинотеатра
        const marker = new google.maps.Marker({
            position: cinemaLocation,
            map: map,
            title: "Кинотеатр Синема Миракл",
        });

        // Попытка получить геолокацию пользователя
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    // Отображение координат пользователя
                    document.getElementById('user-coordinates').innerText =
                        `Ваши координаты: 
                         Широта ${userLocation.lat.toFixed(6)}, 
                         Долгота ${userLocation.lng.toFixed(6)}`;

                    // Добавление маркера для пользователя
                    new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: "Ваше местоположение",
                    });
                },
                () => {
                    document.getElementById('user-coordinates').innerText =
                        "Геолокация отключена или недоступна.";
                }
            );
        } else {
            document.getElementById('user-coordinates').innerText =
                "Ваш браузер не поддерживает геолокацию.";
        }
    };
});
