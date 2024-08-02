import requests

url = 'http://127.0.0.1:5000/api/sensor_data'
data = {
    'timestamp': '2024-05-25T10:00:00',
    'body_temperature': 96.6,
    'blood_oxygen': 68.3,
    'heart_beats': 72,
    'room_humidity': 45.4,
    'room_temperature': 22.4,
    'sudden_movements': 0
}

response = requests.post(url, json=data)
print(response.status_code)
try:
    print(response.json())
except requests.exceptions.JSONDecodeError:
    print("Response content is not in JSON format")
    print(response.text)
