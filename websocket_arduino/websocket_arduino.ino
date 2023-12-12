#include <WiFi.h>
#include <WebSocketsClient.h>

#define INTERNAL_LED 2

const char* ssid = "EatAssDownloadFast";
const char* password = "AmericasA$$";
const char *webSocketUrl = "ws://192.168.1.185";


WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{

  switch (type)
  {
  case WStype_DISCONNECTED:
    Serial.printf("[WSc] Disconnected!\n");
    break;
  case WStype_CONNECTED:
    Serial.printf("[WSc] Connected to url: %s\n", payload);
    break;
  case WStype_TEXT:
    Serial.printf("[WSc] get text: %s\n", payload);
    break;
  case WStype_BIN:
    Serial.printf("[WSc] get binary length: %u\n", length);
    break;
  case WStype_ERROR:
  case WStype_FRAGMENT_TEXT_START:
  case WStype_FRAGMENT_BIN_START:
  case WStype_FRAGMENT:
  case WStype_FRAGMENT_FIN:
  case WStype_PING:
  case WStype_PONG:
    break;
  }
}

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

  // server address, port and URL
  webSocket.begin("192.168.1.185", 3000, "/sendSensorData");

  // event handler
  webSocket.onEvent(webSocketEvent);

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);

}

void loop() {    
    // send message to server when Connected
    webSocket.sendTXT("test string esp32");

    // sleep for some time before next read
    delay(100);

    webSocket.loop();
}
