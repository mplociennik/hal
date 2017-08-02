# -*- coding: utf-8 -*-
import sys
import os
import time
import json
import platform
import datetime
import base64
from robot_websocket_client import RobotWebsocketClient
if platform.system() == 'Linux':
    from picamera import PiCamera


class RobotCamera(RobotWebsocketClient):

    def __init__(self):
        if platform.system() == 'Linux':
            self.camera = PiCamera()
        # camera.resolution = (2592, 1944)

    def get_photo(self):
        if platform.system() == 'Linux':
            photo_name_path = 'camera/camera{0}.jpg'.format(datetime.datetime.now().strftime("%Y-%m-%d-%H:%M:%S"))
            self.camera.capture(photo_name_path)
            time.sleep(0.1)
            photo_object = open(photo_name_path, "r")
            os.remove(photo_name_path)
        else:
            photo_object = {windows: 'test'}
            print('windows test')
        return photo_object

    def on_message(self, ws, message):
        print('json message: ', message)
        dataObj = json.loads(message)
        print("Received message: {0}".format(dataObj))
        if dataObj['event'] == 'photo':
            # its not working must implement stream function
            photo_object = self.get_photo()
            photo_content = base64.b64encode(photo_object.read())
            responseJson = json.dumps({"client": "robotCamera","event": "photo", "data": {'photo_data': photo_content, 'message': 'Streaming photo...'}})
            ws.send(responseJson)
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])

    def on_open(self, ws):
        print('Sending initial request to HalServer')
        initMessage = json.dumps({"client": "robotCamera","event": "init", "data": {'mesage': 'hello server!'}})
        ws.send(initMessage)

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