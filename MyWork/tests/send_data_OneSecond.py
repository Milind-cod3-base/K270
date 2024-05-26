import requests
import time
from datetime import datetime, timedelta

url = 'http://127.0.0.1:5000/api/sensor_data'

# Generate dummy data and send it to the server 5 times
for i in range(5):
    # Generate a timestamp
    timestamp = (datetime.now() + timedelta(seconds=i)).strftime('%Y-%m-%dT%H:%M:%S')
    
    # Create dummy data with slight variations
    data = {
        'timestamp': timestamp,
        'body_temperature': round(36.5 + i * 0.1, 1),
        'blood_oxygen': 98 - i,
        'heart_beats': 72 + i,
        'room_humidity': 45 + i,
        'room_temperature': 22 + i,
        'sudden_movements': i % 2 == 0
    }

    # Send the data to the server
    response = requests.post(url, json=data)
    print(response.status_code, response.json())

    # Wait for 1 second before sending the next data
    time.sleep(1)
