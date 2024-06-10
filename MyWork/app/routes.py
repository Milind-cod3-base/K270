# from flask import Blueprint, request, jsonify  # Import necessary Flask modules
# from .models import SensorData  # Import the SensorData model from models.py
# from . import db  # Import the database instance from the app package

# bp = Blueprint('main', __name__)  # Create a Blueprint named 'main' for organizing routes

# @bp.route('/data', methods=['POST'])  # Define a route for POST requests to '/data'
# def add_data():
#     data = request.get_json()  # Get the JSON data from the request
#     new_data = SensorData(  # Create a new SensorData instance with the provided data
#         body_temperature=data['body_temperature'],
#         blood_oxygen=data['blood_oxygen'],
#         heart_beats=data['heart_beats'],
#         room_humidity=data['room_humidity'],
#         room_temperature=data['room_temperature']
#     )
#     db.session.add(new_data)  # Add the new data to the database session
#     db.session.commit()  # Commit the session to save the data to the database
#     return jsonify({'message': 'Data added successfully'}), 201  # Return a success message as JSON with HTTP status code 201

# @bp.route('/data', methods=['GET'])  # Define a route for GET requests to '/data'
# def get_data():
#     data = SensorData.query.all()  # Query all records from the SensorData table
#     results = [  # Create a list of dictionaries from the queried data
#         {
#             'body_temperature': d.body_temperature,
#             'blood_oxygen': d.blood_oxygen,
#             'heart_beats': d.heart_beats,
#             'room_humidity': d.room_humidity,
#             'room_temperature': d.room_temperature,
#             'timestamp': d.timestamp
#         } for d in data]
#     return jsonify(results)  # Return the results as JSON








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

@current_app.route('/api/sensor_data', methods=['POST'])
def create_sensor_data():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Invalid data'}), 400

    try:
        sensor_data = SensorData(
            timestamp=datetime.strptime(data.get('timestamp'), '%Y-%m-%dT%H:%M:%S'),
            body_temperature=data.get('body_temperature'),
            blood_oxygen=data.get('blood_oxygen'),
            heart_beats=data.get('heart_beats'),
            room_humidity=data.get('room_humidity'),
            room_temperature=data.get('room_temperature'),
            sudden_movements=data.get('sudden_movements')
        )

        db.session.add(sensor_data)
        db.session.commit()

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







# from flask import request, jsonify, render_template, current_app
# from . import db, socketio
# from .models import SensorData

# @current_app.route('/')
# def index():
#     return render_template('index.html')

# @current_app.route('/api/sensor_data', methods=['POST'])
# def create_sensor_data():
#     data = request.get_json()

#     if not data:
#         return jsonify({'error': 'Invalid data'}), 400

#     sensor_data = SensorData(
#         timestamp=data.get('timestamp'),
#         body_temperature=data.get('body_temperature'),
#         blood_oxygen=data.get('blood_oxygen'),
#         heart_beats=data.get('heart_beats'),
#         room_humidity=data.get('room_humidity'),
#         room_temperature=data.get('room_temperature'),
#         sudden_movements=data.get('sudden_movements')
#     )

#     db.session.add(sensor_data)
#     db.session.commit()

#     socketio.emit('new_data', {
#         'timestamp': sensor_data.timestamp,
#         'body_temperature': sensor_data.body_temperature,
#         'blood_oxygen': sensor_data.blood_oxygen,
#         'heart_beats': sensor_data.heart_beats,
#         'room_humidity': sensor_data.room_humidity,
#         'room_temperature': sensor_data.room_temperature,
#         'sudden_movements': sensor_data.sudden_movements
#     })

#     return jsonify({'message': 'Data received successfully'}), 201

# @current_app.route('/api/sensor_data', methods=['GET'])
# def get_sensor_data():
#     sensor_data = SensorData.query.order_by(SensorData.timestamp.desc()).limit(10).all()
#     data = [{
#         'timestamp': sd.timestamp,
#         'body_temperature': sd.body_temperature,
#         'blood_oxygen': sd.blood_oxygen,
#         'heart_beats': sd.heart_beats,
#         'room_humidity': sd.room_humidity,
#         'room_temperature': sd.room_temperature,
#         'sudden_movements': sd.sudden_movements
#     } for sd in sensor_data]
#     return jsonify(data)

# @socketio.on('connect')
# def handle_connect():
#     print('Client connected')

# @socketio.on('disconnect')
# def handle_disconnect():
#     print('Client disconnected')
