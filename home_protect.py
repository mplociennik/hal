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

WEBSOCKET_HOST = 'ws://10.150.128.92:8083/'

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
            time.sleep(2)
            self.alarm()

    def alarm(self):
        print('Sending initial request to HalServer')
        ws = create_connection(WEBSOCKET_HOST)
        initMessage = json.dumps({"client": "protectHome","event": "init"})
        ws.send(initMessage)
        result =  ws.recv()
        print("Received init response: {0}".format(result))
        time.sleep(1)
        print('Sending alarm message to Hal Server.')
        message = json.dumps({"client": "protectHome","event": "alarm", "data": {"message": "Exterminate, Exterminate, Exterminate!"}})
        ws.send(message)
        ws.close()
        self.terminate()

if __name__ == "__main__":
    process = HomeProtectProcess()
    process.start()
    print "Waiting for a while"
    time.sleep(3)
    process.terminate()
    time.sleep(3)
    print "Child process state: %d" % process.is_alive()