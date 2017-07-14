#!/usr/bin/env python
# -*- coding: utf-8 -*-
import multiprocessing
import time
import websocket
import platform
import json
import urllib2
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
PIR_SENSOR = 37
GPIO.setup(PIR_SENSOR, GPIO.IN, GPIO.PUD_DOWN)

if platform.system() == 'Linux':
    from speech import Speech
    from distance import Distance

WEBSOCKET_HOST = 'ws://192.168.1.151:8083/'

class HomeProtectProcess(multiprocessing.Process):

    DIST_TOLERANCE = 10
    alarm_state = False
    def __init__(self, ):
        multiprocessing.Process.__init__(self)
        self.ws = None
        self.exit = multiprocessing.Event()
        self.alarmState = False
        if platform.system() =='Linux':
            self.INITIAL_DISTANCE = int(Distance().detect())
            print('initial distance is: {0} cm'.format(self.INITIAL_DISTANCE))
            
    def start(self, ws):
        self.ws = ws
        while not self.exit.is_set():
            self.watch_pir()
            # self.watch_distance()
        print "Protection stoped!"

    def terminate(self):
        print "Terminating protection..."
        self.exit.set()
        self.ws.close()

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
            self.alarm(alarm_message)

    def alarm(self, message):
        if not self.alarm_state:
            self.alarm_state = True
            print("websocket: {0}".format(self.ws))
            print('Sending alarm message to Hal Server.')
            alarm_message = json.dumps({"client": "protectHome","event": "alarm", "data": {"message": message}})
            print("Alarm message: {0}".format(alarm_message))
            print("socket is {0}".format(self.ws.sock != None))
            priny
            self.ws.send(alarm_message)
            time.sleep(1)
        else:
            print("Alarm state is alreade sended!")
        self.terminate()

class HomeProtect():
    ''' not working websocket connection after alarm '''
    home_protect_process = None
    ws = None
    def __init__(self):
        pass

    def toggle_protect_home(self, state):
        print("toggle protect home state: {0}".format(state))
        if state:
            print("start process")
            self.home_protect_process.start(self.ws)
        else:
            print("stop process")
            try:
                self.ws.close()
                self.home_protect_process.terminate()
            except NameError:
                print("terminate() not found!")
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
        print("Reconnecting...")
        self.start(1)

    def on_open(self, ws):
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
        return state
        
    def start(self, count=None):
        if count is None:
            self.home_protect_process = HomeProtectProcess()
            count = 0
        if count == 1:
            time.sleep(5)
            print("*"*80)
            print("Restarting home_protect")
            print("*"*80)
            del self.ws
        count = count + 1
        print("self.check_connection(): {0} ".format(self.check_connection()))
        if self.check_connection():
            print('Internet connection enabled! Starting socket client...')
            websocket.enableTrace(True)
            self.ws = websocket.WebSocketApp(WEBSOCKET_HOST,
                              on_message = self.on_message,
                              on_error = self.on_error,
                              on_close = self.on_close)
            self.ws.on_open = self.on_open
            self.ws.run_forever()
        else:
            if self.ws is not None:
                print("cos tu nie chaloo")
                self.ws.close()
                self.ws = None
            print('No connection ({0}) reconnectiong for 10 seconds...'.format(count))
            time.sleep(10)
            self.start(count)


if __name__ == "__main__":
    home_protect = HomeProtect()
    home_protect.start()
    # process = HomeProtectProcess()
    # process.start()
    # process.socket_connect()
    # print "Waiting for a while"
    # time.sleep(10)
    # process.terminate()
    # time.sleep(3)
    # print "Child process state: %d" % process.is_alive()