#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import time
import json
import platform
from robot_websocket_client import RobotWebsocketClient

if platform.system() == 'Linux':
    from speech import Speech


class RobotSpeech(RobotWebsocketClient):

    WEBSOCKET_CLIENT_NAME = "robotSpeech"

    def __init__(self):
        self.speech = Speech()

    def on_message(self, ws, message):
        print('json message: ', message)
        dataObj = json.loads(message)
        print("Received message: {0}".format(dataObj))
        if dataObj['event'] == 'speech':
            if dataObj['data']['lector'] == 'dalek':
                self.speech.say_dalek_voice(dataObj['data']['text'])
            else:
                self.speech.say(dataObj['data']['text'])
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])


if __name__ == "__main__":
    robot_speech = RobotSpeech()
    robot_speech.start()