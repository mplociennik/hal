# -*- coding: utf-8 -*-
import sys
import time
import json
import platform
import websocket
import urllib2
if platform.system() == 'Linux':
    from picamera import PiCamera

WEBSOCKET_HOST = 'ws://192.168.1.151:8083/'

class RobotCamera():

    def __init__(self):
        self.camera = PiCamera()
        # camera.resolution = (2592, 1944)

    def get_photo(self):
        self.camera.capture('camera/camera.jpg')
        print('dupa********************************ssssssssss**************')

    def on_message(self, ws, message):
        print('json message: ', message)
        dataObj = json.loads(message)
        print("Received message: {0}".format(dataObj))
        if dataObj['event'] == 'photo':
            photo = self.get_photo()
            responseJson = json.dumps({"client": "robotCamera","event": "init", "data": {'mesage': 'hello server!'}})
            ws.send(responseJson)
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])

    def on_error(self, ws, error):
        print("Socket connection error. Reconnecting after 5 seconds...")
        print(error)
        time.sleep(5)
        self.start()

    def on_close(self, ws):
        print("Socket connection closed. Reconnecting after 5 seconds...")
        time.sleep(5)
        self.start()

    def on_open(self, ws):
        print('Sending initial request to HalServer')
        initMessage = json.dumps({"client": "robotCamera","event": "init", "data": {'mesage': 'hello server!'}})
        ws.send(initMessage)

    def check_connection(self):
        state = False
        try:
            urllib2.urlopen('http://cieniu.pl', timeout=1)
            state = True
        except urllib2.URLError as err: 
            state = False
        return state
        
    def connect(self):
        print("Connectiong to websocket...")
        websocket.enableTrace(True)
        self.ws = websocket.WebSocketApp(WEBSOCKET_HOST,
                          on_message = self.on_message,
                          on_error = self.on_error,
                          on_close = self.on_close)
        self.ws.on_open = self.on_open
        self.ws.run_forever()

    def start(self):
        count = 0
        while self.check_connection() == False:
            count = count + 1
            print("Not found connetion network! Reconnecting ({0})in 15 seconds...".format(count))
            time.sleep(15)

        print('Connection enabled! Starting socket client...')
        self.connect()

if __name__ == "__main__":
    robot_camera = RobotCamera()
    robot_camera.start()