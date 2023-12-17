#include <WiFi.h>
#include <WebSocketsServer.h>

#define INTERNAL_LED 2

const char* ssid = "EatAssDownloadFast";
const char* password = "AmericasA$$";
const char *webSocketUrl = "ws://192.168.1.185";
uint8_t count = 255;

WebSocketsServer webSocket = WebSocketsServer(80);

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length)
{

  switch (type)
  {
  case WStype_DISCONNECTED:
    Serial.printf("[%u] Disconnected!\n", num);
    break;
  case WStype_CONNECTED:
    Serial.printf("[%u] Connection from ", num);
    Serial.println(webSocket.remoteIP(num));
    break;
  case WStype_TEXT:
    Serial.printf("[%u] Text: %s\n", num, payload);

    if ( strncmp((char*)payload, "zap", 3) == 0)
    {
      Serial.println("TURNING ON LIGHT");
      digitalWrite(INTERNAL_LED, HIGH);
      delay(5000);
      digitalWrite(INTERNAL_LED, LOW);
    }

    break;
  case WStype_BIN:
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

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

}

void loop() {    
  webSocket.loop();

  String counter = String(count);
  webSocket.broadcastTXT(counter);
  count--;
  delay(1000);
}
