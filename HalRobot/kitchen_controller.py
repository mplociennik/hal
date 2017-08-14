#!/usr/bin/env python2
#encoding: utf-8

from time import sleep
from robot_websocket_client import RobotWebsocketClient
import RPi.GPIO as GPIO
import json

GPIO.setmode(GPIO.BCM)
SIGNAL_PIN = 2
GPIO.setup(SIGNAL_PIN,GPIO.OUT)
GPIO.output(SIGNAL_PIN, False)


class KitchenController(RobotWebsocketClient):

    def toggle_light(self, state):
        print('Light {0}!'.format(state))
        GPIO.output(SIGNAL_PIN, state)

    def on_message(self, ws, message):
        print('dupa')
        dataObj = json.loads(message)
        print("Received server response: {0}".format(dataObj))
        if dataObj['event'] == 'toggle_kitchen_light':
            self.toggle_light(dataObj['data']['state'])
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])

    def on_open(self, ws):
        sleep(1)
        print('Sending initial request to HalServer')
        initMessage = json.dumps({"client": "kitchenLight", "event": "init", "data": {'message': 'Kitchen light ready.'}})
        ws.send(initMessage)

    def start(self):
        count = 0
        while self.check_connection() == False:
            count = count + 1
            print("Not found connetion network! Reconnecting ({0})in 15 seconds...".format(count))
            time.sleep(15)

        print('Internet connection enabled! Starting socket client...')
        self.connect()

if __name__ == "__main__":
    kitchen_controller = KitchenController()
    kitchen_controller.start()