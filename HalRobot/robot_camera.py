# -*- coding: utf-8 -*-
import sys
import os
import time
import json
import platform
import datetime
import base64
from robot_websocket_client import RobotWebsocketClient
STREAM_CMD = "raspivid -o - -t 0 -w 800 -h 400 | cvlc -vvv stream:///dev/stdin --sout '#rtp{sdp=rtsp://:8554/x}' :demux=h264"

class RobotCamera(RobotWebsocketClient):

    WEBSOCKET_CLIENT_NAME = "robotCamera"
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
        print("Received request: {0}".format(dataObj))
        if dataObj['event'] == 'photo':
            photo_object = self.get_camera_photo()
            piece_number = 0
            while True:
                piece_number = piece_number + 1
                piece = photo_object.read(STREAM_CHUNK)
                photo_content = base64.b64encode(piece)
                responseJson = json.dumps({"from": self.WEBSOCKET_CLIENT_NAME, "to": dataObj['from'], "event": "stream_photo", "data": {'photo_name': photo_object.name,'photo_data': photo_content, 'message': 'Streaming photo...', 'piece_number': piece_number, 'in_progress': True}})
                ws.send(responseJson)
                if not piece:
                    responseJson = json.dumps({"from": self.WEBSOCKET_CLIENT_NAME, "to": dataObj['from'], "event": "stream_photo", "data": {'photo_name': photo_object.name,'photo_data': photo_content, 'message': 'Streaming photo...', 'piece_number': piece_number, 'in_progress': False}})
                    ws.send(responseJson)
                    break
            photo_object.close()
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])


if __name__ == "__main__":
    robot_camera = RobotCamera()
    robot_camera.start()