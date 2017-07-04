#!/usr/bin/env python
# -*- coding: utf-8 -*-
import multiprocessing
import time
from websocket import create_connection
import platform
import json

if platform.system() == 'Linux':
    from speech import Speech
    from distance import Distance

WEBSOCKET_HOST = 'ws://192.168.1.135:8083/'

class HomeProtectProcess(multiprocessing.Process):

    DIST_TOLERANCE = 4
    def __init__(self, ):
        multiprocessing.Process.__init__(self)
        self.exit = multiprocessing.Event()
        if platform.system() =='Linux':
            self.INITIAL_DISTANCE = int(Distance().detect())

    def ws_on_message(self, ws, message):
        print(message)
        message = json.loads(message)
        print("Received Message: {0}".format(message))

    def ws_on_error(self, ws, error):
        print(error)

    def ws_on_close(self, ws):
        print("### closed ###")

    def ws_on_open(self, ws):
        message = json.dumps({"client": "protectHome","event": "message", "data": {"message": "I'm ready to listening!"}})
        self.ws.send(message)
            
    def start(self):
        self.socket_connect()
        while not self.exit.is_set():
            self.watch()
        print "Protection stoped!"

    def terminate(self):
        print "Terminating protection..."
        self.exit.set()

    def detect_opened_door(self, distance):
        sub = distance - self.INITIAL_DISTANCE
        return sub <= self.DIST_TOLERANCE

    def watch(self):
        if platform.system() == 'Linux':
            distance = Distance()
            cm = distance.detect()
            print int(cm)
            if self.detect_opened_door(int(cm)):
                self.alarm()
        else:
            self.alarm()

    def alarm(self):
        print('Sending alarm message to Hal Server.')
        alarm_message = json.dumps({"client": "protectHome","event": "alarm", "data": {"message": "Exterminate, Exterminate, Exterminate!"}})
        self.ws.send(alarm_message)
        time.sleep(1)

    def socket_connect(self):
        websocket.enableTrace(True)
        def on_message(ws, message):
            print("Received server response: {0}".format(message))

        def on_error(ws, error):
            print(error)

        def on_close(ws):
            print("### connection closed ###")

        def on_open(ws):
            print('Sending initial request to HalServer')
            initMessage = json.dumps({"client": "protectHome","event": "init"})
            ws.send(initMessage)

        self.ws = websocket.WebSocketApp("ws://192.168.1.135:8083",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
        self.ws.on_open = on_open
        self.ws.run_forever()

if __name__ == "__main__":
    process = HomeProtectProcess()
    process.start()
    # print "Waiting for a while"
    # time.sleep(10)
    # process.terminate()
    # time.sleep(3)
    # print "Child process state: %d" % process.is_alive()