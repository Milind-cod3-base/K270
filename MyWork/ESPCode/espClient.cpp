#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";
const char* server = "your_flask_server_ip"; // Flask server IP address
const int port = 5000;

WiFiClient client;

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
}

void loop() {
    if (!client.connect(server, port)) {
        Serial.println("Connection to server failed");
        delay(1000);
        return;
    }

    // Replace these with actual sensor readings
    float body_temperature = 36.5;
    float blood_oxygen = 98.0;
    int heart_beats = 72;
    float room_humidity = 45.0;
    float room_temperature = 22.0;
    bool sudden_movements = false;

    // Create JSON object
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["timestamp"] = millis();
    jsonDoc["body_temperature"] = body_temperature;
    jsonDoc["blood_oxygen"] = blood_oxygen;
    jsonDoc["heart_beats"] = heart_beats;
    jsonDoc["room_humidity"] = room_humidity;
    jsonDoc["room_temperature"] = room_temperature;
    jsonDoc["sudden_movements"] = sudden_movements;

    // Serialize JSON to string
    char buffer[512];
    serializeJson(jsonDoc, buffer);

    // Send JSON string to Flask server
    client.print(String("POST /api/sensor_data HTTP/1.1\r\n") +
        "Host: " + server + "\r\n" +
        "Content-Type: application/json\r\n" +
        "Content-Length: " + strlen(buffer) + "\r\n\r\n" +
        buffer + "\r\n");

    // Wait for server response
    while (client.available() == 0) {
        if (!client.connected()) {
            Serial.println("Server disconnected");
            client.stop();
            return;
        }
        delay(1000);
    }

    // Read server response
    while (client.available()) {
        String response = client.readStringUntil('\r');
        Serial.print(response);
    }

    client.stop();
    delay(1000); // Send data every 1 second
}
