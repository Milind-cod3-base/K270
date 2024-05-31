document.addEventListener("DOMContentLoaded", function() {
    console.log('Document is ready');
    const socket = io();

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('new_data', (data) => {
        console.log('New data received:', data);
        updateSensorData(data);
    });

    function fetchLatestSensorData() {
        console.log('Fetching latest sensor data...');
        fetch('/api/latest_sensor_data')
            .then(response => response.json())
            .then(data => {
                console.log('Latest sensor data received:', data);
                updateSensorData(data);
            })
            .catch(error => {
                console.error('Error fetching latest sensor data:', error);
            });
    }

    function updateSensorData(data) {
        if (data.error) {
            console.error('Error in data:', data.error);
            return;
        }
        console.log('Updating sensor data on UI with:', data);
        document.getElementById('body-temperature').textContent = data.body_temperature;
        console.log('Body Temperature updated to:', data.body_temperature);
        document.getElementById('blood-oxygen').textContent = data.blood_oxygen;
        console.log('Blood Oxygen updated to:', data.blood_oxygen);
        document.getElementById('heart-beats').textContent = data.heart_beats;
        console.log('Heart Beats updated to:', data.heart_beats);
        document.getElementById('room-humidity').textContent = data.room_humidity;
        console.log('Room Humidity updated to:', data.room_humidity);
        document.getElementById('room-temperature').textContent = data.room_temperature;
        console.log('Room Temperature updated to:', data.room_temperature);
    }

    // Fetch the latest sensor data on page load
    fetchLatestSensorData();

    // Optionally, fetch latest sensor data at regular intervals
    setInterval(fetchLatestSensorData, 10000); // every 10 seconds
});



// document.addEventListener('DOMContentLoaded', function () {
//     const socket = io.connect('http://127.0.0.1:5000'); // Change this to your server's LAN IP address if needed

//     const temperatureElem = document.getElementById('body-temperature');
//     const oxygenElem = document.getElementById('blood-oxygen');
//     const heartElem = document.getElementById('heart-beats');
//     const humidityElem = document.getElementById('room-humidity');
//     const roomTempElem = document.getElementById('room-temperature');
//     const alertElem = document.getElementById('emergency-alert');

//     const tempChart = createChart('body-temperature-chart', 'Body Temperature (°C)');
//     const oxygenChart = createChart('blood-oxygen-chart', 'Blood Oxygen (%)');
//     const heartChart = createChart('heart-beats-chart', 'Heart Beats (bpm)');
//     const humidityChart = createChart('room-humidity-chart', 'Room Humidity (%)');
//     const roomTempChart = createChart('room-temperature-chart', 'Room Temperature (°C)');

//     function createChart(canvasId, label) {
//         const ctx = document.getElementById(canvasId).getContext('2d');
//         return new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: [],
//                 datasets: [{
//                     label: label,
//                     data: [],
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 2,
//                     fill: false
//                 }]
//             },
//             options: {
//                 scales: {
//                     x: {
//                         type: 'time',
//                         time: {
//                             unit: 'second'
//                         }
//                     },
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     }

//     function updateChart(chart, label, data) {
//         if (chart.data.labels.length > 10) {
//             chart.data.labels.shift();
//             chart.data.datasets[0].data.shift();
//         }
//         chart.data.labels.push(label);
//         chart.data.datasets[0].data.push(data);
//         chart.update();
//     }

//     function fetchLatestData() {
//         fetch('/api/latest_sensor_data')
//             .then(response => response.json())
//             .then(data => {
//                 if (data.error) {
//                     console.error(data.error);
//                     return;
//                 }
//                 const timestamp = new Date(data.timestamp);

//                 temperatureElem.textContent = data.body_temperature;
//                 oxygenElem.textContent = data.blood_oxygen;
//                 heartElem.textContent = data.heart_beats;
//                 humidityElem.textContent = data.room_humidity;
//                 roomTempElem.textContent = data.room_temperature;

//                 updateChart(tempChart, timestamp, data.body_temperature);
//                 updateChart(oxygenChart, timestamp, data.blood_oxygen);
//                 updateChart(heartChart, timestamp, data.heart_beats);
//                 updateChart(humidityChart, timestamp, data.room_humidity);
//                 updateChart(roomTempChart, timestamp, data.room_temperature);

//                 if (data.sudden_movements) {
//                     alertElem.classList.remove('hidden');
//                 } else {
//                     alertElem.classList.add('hidden');
//                 }
//             })
//             .catch(error => console.error('Error fetching latest data:', error));
//     }

//     socket.on('new_data', function (data) {
//         const timestamp = new Date(data.timestamp);

//         temperatureElem.textContent = data.body_temperature;
//         oxygenElem.textContent = data.blood_oxygen;
//         heartElem.textContent = data.heart_beats;
//         humidityElem.textContent = data.room_humidity;
//         roomTempElem.textContent = data.room_temperature;

//         updateChart(tempChart, timestamp, data.body_temperature);
//         updateChart(oxygenChart, timestamp, data.blood_oxygen);
//         updateChart(heartChart, timestamp, data.heart_beats);
//         updateChart(humidityChart, timestamp, data.room_humidity);
//         updateChart(roomTempChart, timestamp, data.room_temperature);

//         if (data.sudden_movements) {
//             alertElem.classList.remove('hidden');
//         } else {
//             alertElem.classList.add('hidden');
//         }
//     });

//     fetchLatestData(); // Fetch the latest data when the page loads
//     setInterval(fetchLatestData, 1000);
// });
