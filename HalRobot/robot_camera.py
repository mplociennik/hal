# -*- coding: utf-8 -*-
import os
import json
from robot_websocket_client import RobotWebsocketClient
STREAM_CMD = "/home/pi/hal/HalRobot/stream_camera.sh &"
STOP_CMD = "killall raspivid && killall cvlc"


class RobotCamera(RobotWebsocketClient):

    WEBSOCKET_CLIENT_NAME = "robotCamera"
    def __init__(self):
        pass

    def stream_camera(self, state):
        if state:
            os.system(STREAM_CMD)
        else:
            os.system(STOP_CMD)

    def on_message(self, ws, message):
        print('json message: ', message)
        dataObj = json.loads(message)
        print("Received request: {0}".format(dataObj))
        if dataObj['event'] == 'stream':
            self.stream_camera(dataObj['data']['state'])
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])


if __name__ == "__main__":
    robot_camera = RobotCamera()
    robot_camera.start()