document.addEventListener('DOMContentLoaded', function () {
    const socket = io.connect('http://127.0.0.1:5000');

    const temperatureElem = document.getElementById('body-temperature');
    const oxygenElem = document.getElementById('blood-oxygen');
    const heartElem = document.getElementById('heart-beats');
    const humidityElem = document.getElementById('room-humidity');
    const roomTempElem = document.getElementById('room-temperature');
    const alertElem = document.getElementById('emergency-alert');

    const tempChart = createChart('body-temperature-chart', 'Body Temperature (°C)');
    const oxygenChart = createChart('blood-oxygen-chart', 'Blood Oxygen (%)');
    const heartChart = createChart('heart-beats-chart', 'Heart Beats (bpm)');
    const humidityChart = createChart('room-humidity-chart', 'Room Humidity (%)');
    const roomTempChart = createChart('room-temperature-chart', 'Room Temperature (°C)');

    function createChart(canvasId, label) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'second'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateChart(chart, label, data) {
        if (chart.data.labels.length > 10) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.data.labels.push(label);
        chart.data.datasets[0].data.push(data);
        chart.update();
    }

    socket.on('new_data', function (data) {
        const timestamp = new Date(data.timestamp);

        temperatureElem.textContent = data.body_temperature;
        oxygenElem.textContent = data.blood_oxygen;
        heartElem.textContent = data.heart_beats;
        humidityElem.textContent = data.room_humidity;
        roomTempElem.textContent = data.room_temperature;

        updateChart(tempChart, timestamp, data.body_temperature);
        updateChart(oxygenChart, timestamp, data.blood_oxygen);
        updateChart(heartChart, timestamp, data.heart_beats);
        updateChart(humidityChart, timestamp, data.room_humidity);
        updateChart(roomTempChart, timestamp, data.room_temperature);

        if (data.sudden_movements) {
            alertElem.classList.remove('hidden');
        } else {
            alertElem.classList.add('hidden');
        }
    });
});
