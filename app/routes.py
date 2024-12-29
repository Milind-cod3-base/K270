from flask import request, jsonify, render_template, current_app, send_from_directory
from datetime import datetime, timezone
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
    return jsonify({'message': 'Heartbeat Check'}), 200


@current_app.route('/api/sensor_data', methods=['POST', 'GET'])
def create_sensor_data():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid or missing JSON payload'}), 400
    try:
        # Use the current timestamp
        timestamp = datetime.now(timezone.utc)

        blood_oxygen = data.get('blood_oxygen') if data.get('blood_oxygen') != -1 else None
        heart_beats = data.get('heart_rate') if data.get('heart_rate') != -1 else None

        # Create a new SensorData instance with the parsed or default timestamp
        sensor_data = SensorData(
            timestamp=timestamp,
            body_temperature=data.get('body_temp'),
            blood_oxygen=blood_oxygen,
            heart_beats=heart_beats,
            room_humidity=data.get('room_humidity'),
            room_temperature=data.get('room_temp'),
            step_count=data.get('step_count')
        )
        db.session.add(sensor_data)
        db.session.commit()
        # Emit the new data over SocketIO
        socketio.emit('new_data', {
            'timestamp': sensor_data.timestamp.strftime('%Y-%m-%dT%H:%M:%S'),
            'body_temperature': sensor_data.body_temperature,
            'blood_oxygen': sensor_data.blood_oxygen,
            'heart_beats': sensor_data.heart_beats,
            'room_humidity': sensor_data.room_humidity,
            'room_temperature': sensor_data.room_temperature,
            'sos': data.get('sos'),
            'step_count': sensor_data.step_count
        })
        return jsonify({'message': 'Data received and stored successfully'}), 201
    except ValueError as e:
        return jsonify({'error': f"Invalid timestamp format: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error storing sensor data: {str(e)}")
        return jsonify({'error': str(e)}), 500


@current_app.route('/api/all_sensor_data', methods=['GET'])
def get_all_sensor_data():
    try:
        # Fetch all sensor data ordered by timestamp
        all_sensor_data = SensorData.query.order_by(SensorData.timestamp.asc()).all()
        data = [{
            'timestamp': sd.timestamp.strftime('%Y-%m-%dT%H:%M:%S'),
            'body_temperature': sd.body_temperature,
            'blood_oxygen': sd.blood_oxygen,
            'heart_beats': sd.heart_beats,
            'room_humidity': sd.room_humidity,
            'room_temperature': sd.room_temperature,
            'step_count': sd.step_count
        } for sd in all_sensor_data]
        return jsonify(data)
    except Exception as e:
        print("Error occurred:", str(e))
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
