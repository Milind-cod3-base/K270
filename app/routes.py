from flask import request, jsonify, render_template, current_app, send_from_directory
from datetime import datetime
from app.models import SensorData
from flask_socketio import emit
from app import db, socketio


@current_app.route('/')
def index():
    return render_template('index.html')


@current_app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(current_app.static_folder, filename)


@current_app.route('/heartbeat', methods=['GET'])
def heartbeat():
    return jsonify({'status': 'OK'}), 200


@current_app.route('/api/sensor_data', methods=['POST'])
def create_sensor_data():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Invalid data'}), 400

    try:
        # Extract and validate fields from the JSON payload
        heart_rate = data.get('heart_rate')
        blood_oxygen = data.get('blood_oxygen')
        body_temp = data.get('body_temp')
        room_temp = data.get('room_temp')
        room_humidity = data.get('room_humidity')
        # Set sudden movements to False since it's not provided
        sudden_movements = False
        # Ensure all required fields are present
        if any(field is None for field in [heart_rate, blood_oxygen, body_temp, room_temp, room_humidity]):
            return jsonify({'error': 'Missing fields in the data'}), 400
        # Create a new SensorData record
        sensor_data = SensorData(
            timestamp=datetime.utcnow(),
            body_temperature=body_temp,
            blood_oxygen=blood_oxygen,
            heart_beats=heart_rate,
            room_humidity=room_humidity,
            room_temperature=room_temp,
            sudden_movements=sudden_movements
        )
        # Save the data to the database
        db.session.add(sensor_data)
        db.session.commit()
        # Emit the data to connected clients via WebSocket
        socketio.emit('new_data', {
            'timestamp': sensor_data.timestamp.strftime('%Y-%m-%dT%H:%M:%S'),
            'body_temperature': sensor_data.body_temperature,
            'blood_oxygen': sensor_data.blood_oxygen,
            'heart_beats': sensor_data.heart_beats,
            'room_humidity': sensor_data.room_humidity,
            'room_temperature': sensor_data.room_temperature,
            'sudden_movements': sensor_data.sudden_movements
        })
        return jsonify({'message': 'Data received successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@current_app.route('/api/latest_sensor_data', methods=['GET'])
def get_latest_sensor_data():
    print("API /api/latest_sensor_data called")
    try:
        sensor_data = SensorData.query.order_by(SensorData.timestamp.desc()).first()
        if sensor_data:
            print("Latest sensor data found:", sensor_data)
            data = {
                'timestamp': sensor_data.timestamp.strftime('%Y-%m-%dT%H:%M:%S'),
                'body_temperature': sensor_data.body_temperature,
                'blood_oxygen': sensor_data.blood_oxygen,
                'heart_beats': sensor_data.heart_beats,
                'room_humidity': sensor_data.room_humidity,
                'room_temperature': sensor_data.room_temperature,
                'sudden_movements': sensor_data.sudden_movements
            }
            print("Data to be returned:", data)
            return jsonify(data)
        else:
            print("No data found")
            return jsonify({'error': 'No data found'}), 404
    except Exception as e:
        print("Error occurred:", str(e))
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@current_app.route('/api/sensor_data_last_10', methods=['GET'])
def get_sensor_data_last_10():
    try:
        sensor_data = SensorData.query.order_by(SensorData.timestamp.desc()).limit(10).all()
        data = [{
            'timestamp': sd.timestamp.strftime('%Y-%m-%dT%H:%M:%S'),
            'body_temperature': sd.body_temperature,
            'blood_oxygen': sd.blood_oxygen,
            'heart_beats': sd.heart_beats,
            'room_humidity': sd.room_humidity,
            'room_temperature': sd.room_temperature
        } for sd in sensor_data]
        print("Charts working")
        return jsonify(data[::-1])  # Reverse to get ascending order
    except Exception as e:
        print("Charts not showing up")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
