#include <WiFi.h>
#include <WebSocketsServer.h>
//#include <HardwareSerial.h>
#include <SoftwareSerial.h>

#define INTERNAL_LED 2

//HardwareSerial Ultrasonic_Sensor(17, 16); //   TX2 (pin 17), RX2 (pin 16) 
SoftwareSerial mySerial(16, 17); //    RX2 green (pin 16), TX2 blue (pin 17) 
 
unsigned char data[4] = {};
float distance;

IPAddress local_IP(192,168,1,41);
IPAddress gateway(192,168,1,1);
IPAddress subnet(255,255,255,0);
IPAddress primaryDNS(8,8,8,8);

const char* ssid = "EatAssDownloadFast";
const char* password = "AmericasA$$";
const char *webSocketUrl = "ws://192.168.1.41";
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
      digitalWrite(18, LOW);
      digitalWrite(19, LOW);
  
      delay(1000);  // 1000 milliseconds or 1 second
  
      digitalWrite(18, HIGH);
      digitalWrite(19, HIGH);
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
  pinMode(INTERNAL_LED, OUTPUT);

  delay(100); //Waiting for serial to connect

  WiFi.mode(WIFI_STA); //Station mode to connect to access point
  
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS)) {
    Serial.println("STA Failed to configure");
  }

  Serial.println("\nAttempting to Connect WiFi");
  WiFi.begin(ssid, password);

  while(WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(500);
  }
  digitalWrite(INTERNAL_LED, HIGH);

  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());
  delay(2000);
  digitalWrite(INTERNAL_LED, LOW);

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  mySerial.begin(9600); // Initialize the hardware serial

  // Control relay
  pinMode(18, OUTPUT);
  digitalWrite(18, HIGH); // High = off | Low = On
  pinMode(19, OUTPUT);
  digitalWrite(19, HIGH);
}

void loop() {    
  webSocket.loop();

  do{
     for(int i=0;i<4;i++)
     {
       data[i]=mySerial.read();
     }
  }while(mySerial.read()==0xff);

  mySerial.flush();

  if(data[0]==0xff)
    {
      int sum;
      sum=(data[0]+data[1]+data[2])&0x00FF;
      if(sum==data[3])
      {
        distance=(data[1]<<8)+data[2];
        if(distance>30)
          {
            //Serial.print("distance=");
            //Serial.print(distance/10);
            //Serial.println("cm");

            String myString;
            myString = String(distance/10);
            webSocket.broadcastTXT(myString);
          }
          else 
          {
            Serial.println("Below the lower limit");
            //webSocket.broadcastTXT("0");
          }
      }else Serial.println("ERROR");
      //webSocket.broadcastTXT("0");
     }
     delay(100);
}
