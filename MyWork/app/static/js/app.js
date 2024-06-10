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
        fetchAndUpdateCharts();  // Fetch and update charts on new data
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

    function fetchAndUpdateCharts() {
        console.log('Fetching last 10 sensor data entries...');
        fetch('/api/sensor_data_last_10')
            .then(response => response.json())
            .then(data => {
                console.log('Last 10 sensor data received:', data);
                updateCharts(data);
            })
            .catch(error => {
                console.error('Error fetching last 10 sensor data:', error);
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

    function initializeCharts() {
        var ctxBodyTemp = document.getElementById('body-temperature-chart').getContext('2d');
        var ctxBloodOxygen = document.getElementById('blood-oxygen-chart').getContext('2d');
        var ctxHeartBeats = document.getElementById('heart-beats-chart').getContext('2d');
        var ctxRoomHumidity = document.getElementById('room-humidity-chart').getContext('2d');
        var ctxRoomTemp = document.getElementById('room-temperature-chart').getContext('2d');

        window.bodyTemperatureChart = new Chart(ctxBodyTemp, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Body Temperature (°C)',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { type: 'time', time: { unit: 'minute' } },
                    y: { beginAtZero: true }
                }
            }
        });

        window.bloodOxygenChart = new Chart(ctxBloodOxygen, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Blood Oxygen (%)',
                    data: [],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { type: 'time', time: { unit: 'minute' } },
                    y: { beginAtZero: true }
                }
            }
        });

        window.heartBeatsChart = new Chart(ctxHeartBeats, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Heart Beats (bpm)',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { type: 'time', time: { unit: 'minute' } },
                    y: { beginAtZero: true }
                }
            }
        });

        window.roomHumidityChart = new Chart(ctxRoomHumidity, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Room Humidity (%)',
                    data: [],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { type: 'time', time: { unit: 'minute' } },
                    y: { beginAtZero: true }
                }
            }
        });

        window.roomTemperatureChart = new Chart(ctxRoomTemp, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Room Temperature (°C)',
                    data: [],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { type: 'time', time: { unit: 'minute' } },
                    y: { beginAtZero: true }
                }
            }
        });
    }

    function updateCharts(data) {
        const labels = data.map(entry => entry.timestamp);
        const bodyTemps = data.map(entry => entry.body_temperature);
        const bloodOxygens = data.map(entry => entry.blood_oxygen);
        const heartBeats = data.map(entry => entry.heart_beats);
        const roomHumidities = data.map(entry => entry.room_humidity);
        const roomTemperatures = data.map(entry => entry.room_temperature);

        bodyTemperatureChart.data.labels = labels;
        bodyTemperatureChart.data.datasets[0].data = bodyTemps;
        bodyTemperatureChart.update();

        bloodOxygenChart.data.labels = labels;
        bloodOxygenChart.data.datasets[0].data = bloodOxygens;
        bloodOxygenChart.update();

        heartBeatsChart.data.labels = labels;
        heartBeatsChart.data.datasets[0].data = heartBeats;
        heartBeatsChart.update();

        roomHumidityChart.data.labels = labels;
        roomHumidityChart.data.datasets[0].data = roomHumidities;
        roomHumidityChart.update();

        roomTemperatureChart.data.labels = labels;
        roomTemperatureChart.data.datasets[0].data = roomTemperatures;
        roomTemperatureChart.update();
    }

    // Fetch the latest sensor data on page load
    fetchLatestSensorData();

    // Fetch the last 10 sensor data on page load
    fetchAndUpdateCharts();

    // Optionally, fetch latest sensor data at regular intervals
    //setInterval(fetchLatestSensorData, 10000); // every 10 seconds
    //setInterval(fetchAndUpdateCharts, 10000); // every 10 seconds

    // Initialize the charts
    initializeCharts();
});





// document.addEventListener("DOMContentLoaded", function() {
//     console.log('Document is ready');
//     const socket = io();

//     socket.on('connect', () => {
//         console.log('Connected to server');
//     });

//     socket.on('disconnect', () => {
//         console.log('Disconnected from server');
//     });

//     socket.on('new_data', (data) => {
//         console.log('New data received:', data);
//         updateSensorData(data);
//         fetchAndUpdateCharts();  // Fetch and update charts on new data
//     });

//     function fetchLatestSensorData() {
//         console.log('Fetching latest sensor data...');
//         fetch('/api/latest_sensor_data')
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Latest sensor data received:', data);
//                 updateSensorData(data);
//             })
//             .catch(error => {
//                 console.error('Error fetching latest sensor data:', error);
//             });
//     }

//     function fetchAndUpdateCharts() {
//         console.log('Fetching last 10 sensor data entries...');
//         fetch('/api/sensor_data_last_10')
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Last 10 sensor data received:', data);
//                 updateCharts(data);
//             })
//             .catch(error => {
//                 console.error('Error fetching last 10 sensor data:', error);
//             });
//     }

//     function updateSensorData(data) {
//         if (data.error) {
//             console.error('Error in data:', data.error);
//             return;
//         }
//         console.log('Updating sensor data on UI with:', data);
//         document.getElementById('body-temperature').textContent = data.body_temperature;
//         console.log('Body Temperature updated to:', data.body_temperature);
//         document.getElementById('blood-oxygen').textContent = data.blood_oxygen;
//         console.log('Blood Oxygen updated to:', data.blood_oxygen);
//         document.getElementById('heart-beats').textContent = data.heart_beats;
//         console.log('Heart Beats updated to:', data.heart_beats);
//         document.getElementById('room-humidity').textContent = data.room_humidity;
//         console.log('Room Humidity updated to:', data.room_humidity);
//         document.getElementById('room-temperature').textContent = data.room_temperature;
//         console.log('Room Temperature updated to:', data.room_temperature);
//     }

//     let bodyTemperatureChart, bloodOxygenChart, heartBeatsChart, roomHumidityChart, roomTemperatureChart;

//     function initializeCharts() {
//         const ctx1 = document.getElementById('body-temperature-chart').getContext('2d');
//         const ctx2 = document.getElementById('blood-oxygen-chart').getContext('2d');
//         const ctx3 = document.getElementById('heart-beats-chart').getContext('2d');
//         const ctx4 = document.getElementById('room-humidity-chart').getContext('2d');
//         const ctx5 = document.getElementById('room-temperature-chart').getContext('2d');

//         bodyTemperatureChart = new Chart(ctx1, {
//             type: 'line',
//             data: {
//                 labels: [],
//                 datasets: [{
//                     label: 'Body Temperature (°C)',
//                     data: [],
//                     borderColor: 'rgba(255, 99, 132, 1)',
//                     borderWidth: 1,
//                     fill: false
//                 }]
//             },
//             options: {
//                 scales: {
//                     x: { type: 'time', time: { unit: 'minute' } },
//                     y: { beginAtZero: true }
//                 }
//             }
//         });

//         bloodOxygenChart = new Chart(ctx2, {
//             type: 'line',
//             data: {
//                 labels: [],
//                 datasets: [{
//                     label: 'Blood Oxygen (%)',
//                     data: [],
//                     borderColor: 'rgba(54, 162, 235, 1)',
//                     borderWidth: 1,
//                     fill: false
//                 }]
//             },
//             options: {
//                 scales: {
//                     x: { type: 'time', time: { unit: 'minute' } },
//                     y: { beginAtZero: true }
//                 }
//             }
//         });

//         heartBeatsChart = new Chart(ctx3, {
//             type: 'line',
//             data: {
//                 labels: [],
//                 datasets: [{
//                     label: 'Heart Beats (bpm)',
//                     data: [],
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1,
//                     fill: false
//                 }]
//             },
//             options: {
//                 scales: {
//                     x: { type: 'time', time: { unit: 'minute' } },
//                     y: { beginAtZero: true }
//                 }
//             }
//         });

//         roomHumidityChart = new Chart(ctx4, {
//             type: 'line',
//             data: {
//                 labels: [],
//                 datasets: [{
//                     label: 'Room Humidity (%)',
//                     data: [],
//                     borderColor: 'rgba(153, 102, 255, 1)',
//                     borderWidth: 1,
//                     fill: false
//                 }]
//             },
//             options: {
//                 scales: {
//                     x: { type: 'time', time: { unit: 'minute' } },
//                     y: { beginAtZero: true }
//                 }
//             }
//         });

//         roomTemperatureChart = new Chart(ctx5, {
//             type: 'line',
//             data: {
//                 labels: [],
//                 datasets: [{
//                     label: 'Room Temperature (°C)',
//                     data: [],
//                     borderColor: 'rgba(255, 159, 64, 1)',
//                     borderWidth: 1,
//                     fill: false
//                 }]
//             },
//             options: {
//                 scales: {
//                     x: { type: 'time', time: { unit: 'minute' } },
//                     y: { beginAtZero: true }
//                 }
//             }
//         });
//     }

//     function updateCharts(data) {
//         const labels = data.map(entry => entry.timestamp);
//         const bodyTemps = data.map(entry => entry.body_temperature);
//         const bloodOxygens = data.map(entry => entry.blood_oxygen);
//         const heartBeats = data.map(entry => entry.heart_beats);
//         const roomHumidities = data.map(entry => entry.room_humidity);
//         const roomTemperatures = data.map(entry => entry.room_temperature);
       

//         bodyTemperatureChart.data.labels = labels;
//         bodyTemperatureChart.data.datasets[0].data = bodyTemps;
//         bodyTemperatureChart.update();

//         bloodOxygenChart.data.labels = labels;
//         bloodOxygenChart.data.datasets[0].data = bloodOxygens;
//         bloodOxygenChart.update();

//         heartBeatsChart.data.labels = labels;
//         heartBeatsChart.data.datasets[0].data = heartBeats;
//         heartBeatsChart.update();

//         roomHumidityChart.data.labels = labels;
//         roomHumidityChart.data.datasets[0].data = roomHumidities;
//         roomHumidityChart.update();

//         roomTemperatureChart.data.labels = labels;
//         roomTemperatureChart.data.datasets[0].data = roomTemperatures;
//         roomTemperatureChart.update();
//     }

//     // Fetch the latest sensor data on page load
//     fetchLatestSensorData();

//     // Fetch the last 10 sensor data on page load
//     fetchAndUpdateCharts();

//     // Optionally, fetch latest sensor data at regular intervals
//     //setInterval(fetchLatestSensorData, 10000); // every 10 seconds
//     //setInterval(fetchAndUpdateCharts, 10000); // every 10 seconds

//     // Initialize the charts
//     initializeCharts();
// });
