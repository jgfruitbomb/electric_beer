#include <WiFi.h>
#include <WebSocketsClient.h>

#define INTERNAL_LED 2

const char* ssid = "EatAssDownloadFast";
const char* password = "AmericasA$$";
const char *webSocketUrl = "ws://192.168.1.185";

WebSocketsClient webSocket;

void setup() {
  Serial.begin(115200);
  delay(1000);
  pinMode(INTERNAL_LED, OUTPUT);

  WiFi.mode(WIFI_STA); //Optional
  WiFi.begin(ssid, password);
  Serial.println("\nAttempting to Connect WiFi");

  while(WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(100);
  }
  digitalWrite(INTERNAL_LED, HIGH);
  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());
  delay(2000);
  digitalWrite(INTERNAL_LED, LOW);

  webSocket.begin(webSocketUrl, 3000, "/");

  // Handle WebSocket events
  webSocket.onEvent([](WStype_t type, uint8_t *payload, size_t length) {
    switch (type) {
      case WStype_CONNECTED:
        Serial.println("Connected to server");
        webSocket.sendTXT("hello world");
        break;
      case WStype_TEXT:
        Serial.printf("Received text: %s\n", payload);
        break;
      case WStype_DISCONNECTED:
        Serial.println("Disconnected from server");
        break;
      default:
        break;
    }
  });
}

void loop() {

}
