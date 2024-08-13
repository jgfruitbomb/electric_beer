#include <WiFi.h>
#include <WebSocketsServer.h>
#include <HardwareSerial.h>

#define INTERNAL_LED 2

HardwareSerial Ultrasonic_Sensor(2); //   TX2 (pin 17), RX2 (pin 16) 
 
unsigned char data[4] = {};
float distance;

const char* ssid = "EatAssDownloadFast";
const char* password = "AmericasA$$";
const char *webSocketUrl = "ws://192.168.1.185";
uint8_t count = 10;

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
      digitalWrite(18, HIGH);
      digitalWrite(19, HIGH);
  
      delay(1000);  // 1000 milliseconds or 1 second
  
      digitalWrite(18, LOW);
      digitalWrite(19, LOW);
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
  Serial.begin(9600);
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
  Ultrasonic_Sensor.begin(9600); // Initialize the hardware serial

  // Control relay
  pinMode(18, OUTPUT);
  digitalWrite(18, LOW);
  pinMode(19, OUTPUT);
  digitalWrite(19, LOW);
}

void loop() {    
  webSocket.loop();

  do{
     for(int i=0;i<4;i++)
     {
       data[i]=Ultrasonic_Sensor.read();
     }
  }while(Ultrasonic_Sensor.read()==0xff);

  Ultrasonic_Sensor.flush();

  if(data[0]==0xff)
    {
      int sum;
      sum=(data[0]+data[1]+data[2])&0x00FF;
      if(sum==data[3])
      {
        distance=(data[1]<<8)+data[2];
        if(distance>30)
          {
           Serial.print("distance=");
           Serial.print(distance/10);
           Serial.println("cm");

      String myString;
      myString = String(distance/10);
      webSocket.broadcastTXT(myString);
          }else 
             {
               Serial.println("Below the lower limit");
               //webSocket.broadcastTXT("0");
             }
      }else Serial.println("ERROR");
      //webSocket.broadcastTXT("0");
     }
     delay(100);
}
