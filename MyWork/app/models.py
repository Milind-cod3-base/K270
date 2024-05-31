# Parse JSON Data and Store It in the Database Using SQLAlchemy
# This file defines the SQLAlchemy models, which represent the database tables.
from datetime import datetime
from . import db

class SensorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    body_temperature = db.Column(db.Float, nullable=False, index=True)
    blood_oxygen = db.Column(db.Float, nullable=False, index=True)
    heart_beats = db.Column(db.Integer, nullable=False, index=True)
    room_humidity = db.Column(db.Float, nullable=False, index=True)
    room_temperature = db.Column(db.Float, nullable=False, index=True)
    sudden_movements = db.Column(db.Boolean, nullable=False, index=True)

    def __repr__(self):
        return f'<SensorData {self.id}>'
