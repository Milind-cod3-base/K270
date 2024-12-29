document.addEventListener("DOMContentLoaded", function () {
    console.log('Document is ready');
    const socket = io();
    let popupQueue = [];
    let activePopup = null;
    let stepCountBuffer = []; // Buffer for step count data
    let lastStepCountTimestamp = null; // To track the last update timestamp for step count

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
        if (data.sos) {
            const timestamp = new Date(data.timestamp).toLocaleString();
            queuePopup(`Emergency SOS alert at ${timestamp}`);
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
        console.log('Fetching all sensor data entries...');
        fetch('/api/all_sensor_data')
            .then(response => response.json())
            .then(data => {
                console.log('All sensor data received:', data);
                updateCharts(data);
            })
            .catch(error => {
                console.error('Error fetching all sensor data:', error);
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
        document.getElementById('step-count').textContent = data.step_count;
        console.log('Step Count updated to:', data.step_count);

        const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        if (!lastStepCountTimestamp || currentTimestamp > lastStepCountTimestamp) {
            stepCountBuffer.push({ timestamp: data.timestamp, step_count: data.step_count });
            lastStepCountTimestamp = currentTimestamp;

            // Update the UI with the latest step count
            document.getElementById('step-count').textContent = data.step_count;
            console.log('Step Count updated to:', data.step_count);
        }
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

        Plotly.newPlot('step-count-chart', [], {
            title: 'Step Count',
            yaxis: { title: 'Steps' },
            xaxis: { title: 'Timestamp' },
            type: 'bar'
        });
    }

    function updateCharts(data) {
        const timestamps = data.map(entry => entry.timestamp);
        const bodyTemps = data.map(entry => entry.body_temperature);
        const bloodOxygens = data.map(entry => entry.blood_oxygen);
        const heartBeats = data.map(entry => entry.heart_beats);
        const roomHumidities = data.map(entry => entry.room_humidity);
        const roomTemperatures = data.map(entry => entry.room_temperature);

        const filteredStepCountData = stepCountBuffer.reduce((acc, current) => {
            const last = acc[acc.length - 1];
            if (!last || new Date(current.timestamp).getSeconds() !== new Date(last.timestamp).getSeconds()) {
                acc.push(current);
            }
            return acc;
        }, []);
        const stepCountTimestamps = filteredStepCountData.map(entry => entry.timestamp);
        const stepCounts = filteredStepCountData.map(entry => entry.step_count);


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

        Plotly.react('step-count-chart', [{
            x: stepCountTimestamps,
            y: stepCounts,
            type: 'bar',
            name: 'Step Count'
        }], {
            title: 'Step Count',
            yaxis: { title: 'Steps' },
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
                <span class="close-btn">×</span>
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(popup);

        // Play emergency sound
        emergencySound.play();

        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification("SOS!", {
                body: message,
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

    // Fetch and update charts on page load
    fetchAndUpdateCharts();

    // Initialize the charts
    initializeCharts();
});