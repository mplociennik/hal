#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time
import platform
import json
import threading
from robot_websocket_client import RobotWebsocketClient


if platform.system() == 'Linux':
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BOARD)
    PIR_SENSOR = 37
    GPIO.setup(PIR_SENSOR, GPIO.IN, GPIO.PUD_DOWN)
    from distance import Distance


class RobotHomeProtect(RobotWebsocketClient):
    DIST_TOLERANCE = 10
    alarm_state = False
    alarm_to = None
    WEBSOCKET_CLIENT_NAME = "protectHome"

    def __init__(self):
        if platform.system() =='Linux':
            self.INITIAL_DISTANCE = int(Distance().detect())
            print('initial distance is: {0} cm'.format(self.INITIAL_DISTANCE))

    def alarm(self, message):
        print('Sending alarm message to')
        alarm_message = json.dumps({"from": "protectHome", "to": self.alarm_to,"event": "alarm", "data": {"message": message}})
        print("Alarm message: {0}".format(alarm_message))
        print("socket is {0}".format(self.ws.sock != None))
        self.ws.send(alarm_message)
        self.alarm_enabled = False
        time.sleep(3)

    def detect_opened_door(self, distance):
        sub = distance - self.INITIAL_DISTANCE
        print("sub: {0}".format(sub))
        print("sub abs: {0}".format(abs(sub)))
        return abs(sub) >= self.DIST_TOLERANCE

    def watch_distance(self):
        if platform.system() == 'Linux':
            while self.protect_state:
                distance = Distance()
                cm = distance.detect()
                print('Distance: {0} cm'.format(int(cm)))
                if self.detect_opened_door(int(cm)):
                    self.alarm("Detected changed distance: {0}!".format(int(cm)))
                time.sleep(1)
        else:
            self.alarm("Alarm debug in windows.")    

    def watch_pir(self):
        if platform.system() == 'Linux':
            while self.protect_state:
                print("PIR is watching...")
                time.sleep(0.1)
                current_state = GPIO.input(PIR_SENSOR)
                print("Current state pir: {0}".format(current_state))
                if current_state == 1:
                    self.alarm_enabled = True
                    self.alarm("Movement detected!")
                    time.sleep(2)
                else:
                    self.alarm_enabled = False
        else:
            alarm_message = "Movement detected test windows!"
            self.alarm(alarm_message)
            time.sleep(3)
            
    def toggle_protect_home(self, alarm_to, state):
        print("toggle protect home state: {0}".format(state))
        if state:
            self.protect_state = True
            self.alarm_to = alarm_to
            print("self.protect_state: {0}".format(self.protect_state))
            t = threading.Thread(target=self.watch_pir)
            t.setDaemon(True)
            t.start()
        else:
            self.protect_state = False
            self.alarm_to = None
                
    def on_message(self, ws, message):
        dataObj = json.loads(message)
        print("Received request: {0}".format(dataObj))
        if dataObj['event'] == 'protectHome':
            self.toggle_protect_home(dataObj['from'], dataObj['data']['state'])
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])


if __name__ == "__main__":
    home_protect = RobotHomeProtect()
    home_protect.start()