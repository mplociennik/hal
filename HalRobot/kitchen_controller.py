#!/usr/bin/env python2
#encoding: utf-8

from time import sleep
from robot_websocket_client import RobotWebsocketClient
import RPi.GPIO as GPIO
import json

GPIO.setmode(GPIO.BCM)
SIGNAL_PIN = 2
GPIO.setup(SIGNAL_PIN,GPIO.OUT)
GPIO.output(SIGNAL_PIN, True)


class KitchenController(RobotWebsocketClient):

    WEBSOCKET_CLIENT_NAME = "kitchenLight"
    def revert_state(self, state):
        return not state

    def toggle_light(self, state):
        print('Light {0}!'.format(state))
        GPIO.output(SIGNAL_PIN, self.revert_state(state))

    def on_message(self, ws, message):
        dataObj = json.loads(message)
        print("Received server response: {0}".format(dataObj))
        if dataObj['event'] == 'toggleKitchenLight':
            self.toggle_light(dataObj['data']['state'])
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])

if __name__ == "__main__":
    try:
        kitchen_controller = KitchenController()
        kitchen_controller.start()
    except KeyboardInterrupt:
        print "interrupt"
    finally:
        GPIO.cleanup()
