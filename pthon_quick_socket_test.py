import websocket

ws = websocket.WebSocket()
espServer = "ws://192.168.1.40/"
ws.connect(espServer)

print("Connected to Websocket server")

while True:
    try:
        result = ws.recv()
        print(result)
    except:
        pass