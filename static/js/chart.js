document.addEventListener('DOMContentLoaded', () => {
    const chartDataElement = document.getElementById('chart-data');
    if (!chartDataElement) {
        console.error("Chart data not found!");
        return;
    }

    const chartData = JSON.parse(chartDataElement.textContent);
    const xValues = chartData.xValues;
    const sinSeriesValues = chartData.sinSeriesValues;
    const mathSinValues = chartData.mathSinValues;

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: 'sin(x) (series)',
                    data: sinSeriesValues,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    tension: 0.1,
                    pointRadius: 2.5,  // Устанавливаем размер точек
                    // Анимация для линии sin(x) (series)
                    borderWidth: 2,
                    animation: {
                        duration: 3000,  // Анимация займет 3 секунды
                        easing: 'easeOutQuad',  // Плавное замедление
                        onProgress: function(animation) {
                            this.data.datasets[0].data = sinSeriesValues.slice(0, Math.round(animation.currentStep / animation.numSteps * sinSeriesValues.length));
                            this.update();
                        }
                    }
                },
                {
                    label: 'Math.sin(x)',
                    data: mathSinValues,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                    tension: 0.1,
                    pointRadius: 2.5,  // Устанавливаем размер точек
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 0,
                            yMax: 0,
                            borderColor: 'rgba(0, 255, 0, 0.5)',
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: 'Ось Y = 0',
                                position: 'start', // Центр линии
                                color: 'grey', // Цвет текста
                                backgroundColor: 'rgba(200, 200, 200, 0.8)', // Прозрачный фон
                                font: {
                                    size: 12,
                                },
                                padding: 8 // Внутренний отступ
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Аргумент x', // Подпись оси X
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Значение функции', // Подпись оси Y
                    }
                }
            }
        }
    });
});
