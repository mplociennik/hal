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

    def on_open(self, ws):
        print('Sending initial request to HalServer')
        initMessage = json.dumps({"client": "robotSpeech","event": "init", "data": {'mesage': 'hello server!'}})
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
    robot_speech = RobotSpeech()
    robot_speech.start()