document.addEventListener("DOMContentLoaded", function() {
    console.log('Document is ready');
    const socket = io();
    let popupQueue = [];
    let activePopup = null;

    const emergencySound = document.getElementById('emergency-sound');

    // Request notification permission
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.log('Notification permission denied.');
            }
        });
    }

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

        // Check for sudden movement
        if (data.sudden_movements) {
            const timestamp = new Date(data.timestamp).toLocaleString();
            queuePopup(`Sudden movement detected at ${timestamp}`);
        }
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
        Plotly.newPlot('body-temperature-chart', [], {
            title: 'Body Temperature (°C)',
            yaxis: { title: 'Body Temperature (°C)' },
            xaxis: { title: 'Timestamp' }
        });

        Plotly.newPlot('blood-oxygen-chart', [], {
            title: 'Blood Oxygen (%)',
            yaxis: { title: 'Blood Oxygen (%)' },
            xaxis: { title: 'Timestamp' }
        });

        Plotly.newPlot('heart-beats-chart', [], {
            title: 'Heart Beats (bpm)',
            yaxis: { title: 'Heart Beats (bpm)' },
            xaxis: { title: 'Timestamp' }
        });

        Plotly.newPlot('room-humidity-chart', [], {
            title: 'Room Humidity (%)',
            yaxis: { title: 'Room Humidity (%)' },
            xaxis: { title: 'Timestamp' }
        });

        Plotly.newPlot('room-temperature-chart', [], {
            title: 'Room Temperature (°C)',
            yaxis: { title: 'Room Temperature (°C)' },
            xaxis: { title: 'Timestamp' }
        });
    }

    function updateCharts(data) {
        const timestamps = data.map(entry => entry.timestamp);
        const bodyTemps = data.map(entry => entry.body_temperature);
        const bloodOxygens = data.map(entry => entry.blood_oxygen);
        const heartBeats = data.map(entry => entry.heart_beats);
        const roomHumidities = data.map(entry => entry.room_humidity);
        const roomTemperatures = data.map(entry => entry.room_temperature);

        Plotly.react('body-temperature-chart', [{
            x: timestamps,
            y: bodyTemps,
            type: 'scatter',
            mode: 'lines',
            name: 'Body Temperature'
        }], {
            title: 'Body Temperature (°C)',
            yaxis: { title: 'Body Temperature (°C)' },
            xaxis: { title: 'Timestamp' }
        });

        Plotly.react('blood-oxygen-chart', [{
            x: timestamps,
            y: bloodOxygens,
            type: 'scatter',
            mode: 'lines',
            name: 'Blood Oxygen'
        }], {
            title: 'Blood Oxygen (%)',
            yaxis: { title: 'Blood Oxygen (%)' },
            xaxis: { title: 'Timestamp' }
        });

        Plotly.react('heart-beats-chart', [{
            x: timestamps,
            y: heartBeats,
            type: 'scatter',
            mode: 'lines',
            name: 'Heart Beats'
        }], {
            title: 'Heart Beats (bpm)',
            yaxis: { title: 'Heart Beats (bpm)' },
            xaxis: { title: 'Timestamp' }
        });

        Plotly.react('room-humidity-chart', [{
            x: timestamps,
            y: roomHumidities,
            type: 'scatter',
            mode: 'lines',
            name: 'Room Humidity'
        }], {
            title: 'Room Humidity (%)',
            yaxis: { title: 'Room Humidity (%)' },
            xaxis: { title: 'Timestamp' }
        });

        Plotly.react('room-temperature-chart', [{
            x: timestamps,
            y: roomTemperatures,
            type: 'scatter',
            mode: 'lines',
            name: 'Room Temperature'
        }], {
            title: 'Room Temperature (°C)',
            yaxis: { title: 'Room Temperature (°C)' },
            xaxis: { title: 'Timestamp' }
        });
    }

    function queuePopup(message) {
        popupQueue.push(message);
        showNextPopup();
    }

    function showNextPopup() {
        if (activePopup || popupQueue.length === 0) {
            return;
        }
        activePopup = popupQueue.shift();
        createPopup(activePopup);
    }

    function createPopup(message) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close-btn">&times;</span>
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(popup);

        // Play emergency sound
        emergencySound.play();

        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification("Fall Detected!", {
                body: message,
                icon: '/static/img/alert-icon.png' // Add an icon if desired
            });
        }

        const closeButton = popup.querySelector('.close-btn');
        closeButton.addEventListener('click', () => {
            popup.remove();
            emergencySound.pause();
            emergencySound.currentTime = 0;
            activePopup = null;
            showNextPopup();
        });
    }

    // Fetch the latest sensor data on page load
    fetchLatestSensorData();

    // Fetch the last 10 sensor data on page load
    fetchAndUpdateCharts();

    // Initialize the charts
    initializeCharts();
});
