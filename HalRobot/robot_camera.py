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


STREAM_CHUNK = 1024


class RobotCamera(RobotWebsocketClient):

    def __init__(self):
        if platform.system() == 'Linux':
            self.camera = PiCamera()
        # camera.resolution = (2592, 1944)

    def get_camera_photo(self):
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
            photo_object = self.get_camera_photo()
            piece_number = 0
            while True:
                piece_number = piece_number + 1
                piece = photo_object.read(STREAM_CHUNK)
                photo_content = base64.b64encode(piece)
                responseJson = json.dumps({"client": "robotCamera","event": "stream_photo", "data": {'photo_name': photo_object.name,'photo_data': photo_content, 'message': 'Streaming photo...', 'piece_number': piece_number, 'in_progress': True}})
                ws.send(responseJson)
                if not piece:
                    responseJson = json.dumps({"client": "robotCamera","event": "stream_photo", "data": {'photo_name': photo_object.name,'photo_data': photo_content, 'message': 'Streaming photo...', 'piece_number': piece_number, 'in_progress': False}})
                    ws.send(responseJson)
                    break
            photo_object.close()


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