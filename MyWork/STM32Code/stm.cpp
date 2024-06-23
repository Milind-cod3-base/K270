#include "main.h"
#include "i2c.h"
#include "usart.h"
#include "gpio.h"
#include "cJSON.h"  // Include cJSON library

void SystemClock_Config(void);
void Error_Handler(void);

int main(void) {
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();
    MX_I2C1_Init();
    MX_USART2_UART_Init();

    char jsonBuffer[256];

    while (1) {
        // Collect sensor data
        float bodyTemp = readBodyTemp();
        float bloodOxygen = readBloodOxygen();
        int heartBeats = readHeartBeats();
        float roomHumidity = readRoomHumidity();
        float roomTemp = readRoomTemp();

        // Create JSON object
        cJSON *root = cJSON_CreateObject();
        cJSON_AddNumberToObject(root, "body_temperature", bodyTemp);
        cJSON_AddNumberToObject(root, "blood_oxygen", bloodOxygen);
        cJSON_AddNumberToObject(root, "heart_beats", heartBeats);
        cJSON_AddNumberToObject(root, "room_humidity", roomHumidity);
        cJSON_AddNumberToObject(root, "room_temperature", roomTemp);

        // Convert JSON object to string
        char *jsonString = cJSON_Print(root);
        snprintf(jsonBuffer, sizeof(jsonBuffer), "%s", jsonString);

        // Send JSON string over USART
        HAL_UART_Transmit(&huart2, (uint8_t *)jsonBuffer, strlen(jsonBuffer), HAL_MAX_DELAY);

        // Clean up
        cJSON_Delete(root);
        HAL_Delay(1000); // Send data every second
    }
}

// Define functions to read sensor data
float readBodyTemp() {
    // Read body temperature sensor data
}

float readBloodOxygen() {
    // Read blood oxygen sensor data
}

int readHeartBeats() {
    // Read heart beats sensor data
}

float readRoomHumidity() {
    // Read room humidity sensor data
}

float readRoomTemp() {
    // Read room temperature sensor data
}

void SystemClock_Config(void) {
    // System clock configuration
}

void Error_Handler(void) {
    // Error handler
}
