#!/usr/bin/env python
# -*- coding: utf-8 -*-
import multiprocessing
import time
import platform
import json
import urllib2
import websocket
import threading


if platform.system() == 'Linux':
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BOARD)
    PIR_SENSOR = 37
    GPIO.setup(PIR_SENSOR, GPIO.IN, GPIO.PUD_DOWN)
    from speech import Speech
    from distance import Distance

WEBSOCKET_HOST = 'ws://127.0.0.1:8083/'


class HomeProtectProcess(multiprocessing.Process):

    DIST_TOLERANCE = 10
    alarm_state = False
    def __init__(self, ):
        multiprocessing.Process.__init__(self)
        self.exit = multiprocessing.Event()
        if platform.system() =='Linux':
            self.INITIAL_DISTANCE = int(Distance().detect())
            print('initial distance is: {0} cm'.format(self.INITIAL_DISTANCE))
            
    def start(self):
        print("Starting home protection process...")
        while not self.exit.is_set():
            self.watch_pir()
            # self.watch_distance()
        print "Protection stoped!"

    def terminate(self):
        print "Terminating protection..."
        self.exit.set()

    def detect_opened_door(self, distance):
        sub = distance - self.INITIAL_DISTANCE
        print("sub: {0}".format(sub))
        print("sub abs: {0}".format(abs(sub)))
        return abs(sub) >= self.DIST_TOLERANCE

    def watch_distance(self):
        if platform.system() == 'Linux':
            distance = Distance()
            cm = distance.detect()
            print('Distance: {0} cm'.format(int(cm)))
            if self.detect_opened_door(int(cm)):
                self.alarm("Dected changed distance: {0}!".format(int(cm)))
        else:
            self.alarm("Alarm debug in windows.")    

    def watch_pir(self):
        if platform.system() == 'Linux':
            while True:
                time.sleep(0.1)
                current_state = GPIO.input(PIR_SENSOR)
                if current_state == 1:
                  self.alarm("Movement detected!")
                  time.sleep(2)
        else:
            alarm_message = "Movement detected test windows!"
            time.sleep(3)
            self.alarm(alarm_message)

    def alarm(self, message):
        if not self.alarm_state:
            self.alarm_state = True


class HomeProtect():
    ws = None
    DIST_TOLERANCE = 10
    alarm_state = False
    def __init__(self):
        if platform.system() =='Linux':
            self.INITIAL_DISTANCE = int(Distance().detect())
            print('initial distance is: {0} cm'.format(self.INITIAL_DISTANCE))

    def alarm(self, message):
        print('Sending alarm message to Hal Server.')
        alarm_message = json.dumps({"client": "protectHome","event": "alarm", "data": {"message": message}})
        print("Alarm message: {0}".format(alarm_message))
        print("socket is {0}".format(self.ws.sock != None))
        self.ws.send(alarm_message)
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
                    self.alarm("Dected changed distance: {0}!".format(int(cm)))
                time.sleep(1)
        else:
            self.alarm("Alarm debug in windows.")    

    def watch_pir(self):
        if platform.system() == 'Linux':
            while self.protect_state:
                time.sleep(0.1)
                current_state = GPIO.input(PIR_SENSOR)
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
            
    def toggle_protect_home(self, state):
        print("toggle protect home state: {0}".format(state))
        if state:
            self.protect_state = True
            print("self.watch_alarm_state: {0}".format(self.protect_state))
            t = threading.Thread(target=self.watch_pir)
            t.setDaemon(True)
            t.start()
        else:
            self.protect_state = False
                
    def on_message(self, ws, message):
        dataObj = json.loads(message)
        print("Received server response: {0}".format(dataObj))
        if dataObj['event'] == 'protectHome':
            self.toggle_protect_home(dataObj['data']['state'])
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])

    def on_error(self, ws, error):
        print("jakis err")
        print(error)

    def on_close(self, ws):
        print("### connection closed ###")

    def on_open(self, ws):
        time.sleep(1)
        print('Sending initial request to HalServer')
        initMessage = json.dumps({"client": "protectHome","event": "init", "data": {'mesage': 'hello server!'}})
        ws.send(initMessage)

    def check_connection(self):
        state = False
        try:
            urllib2.urlopen('http://cieniu.pl', timeout=1)
            state = True
        except urllib2.URLError as err: 
            state = False
        print("self.check_connection() state: {0} ".format(state))
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
        
        print('Internet connection enabled! Starting socket client...')
        self.connect()
        

if __name__ == "__main__":
    home_protect = HomeProtect()
    # home_protect = HomeProtectProcess()
    home_protect.start()