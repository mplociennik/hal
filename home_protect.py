#!/usr/bin/env python
# -*- coding: utf-8 -*-
import multiprocessing
import time
import websocket
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
        self.ws = None
        self.exit = multiprocessing.Event()
        if platform.system() =='Linux':
            self.INITIAL_DISTANCE = int(Distance().detect())
            print('initial distance is: {0} cm'.format(self.INITIAL_DISTANCE))
            
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
            print('Distance: {0} cm'.format(int(cm)))
            if self.detect_opened_door(int(cm)):
                self.alarm()
        else:
            print('dupa dupa')
            self.alarm()

    def alarm(self):
        print("websocket: {0}".format(self.ws))
        print('Sending alarm message to Hal Server.')
        alarm_message = json.dumps({"client": "protectHome","event": "alarm", "data": {"message": "Exterminate, Exterminate, Exterminate!"}})
        print("socket is {0}".format(self.ws.sock != None))
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
            initMessage = json.dumps({"client": "protectHome","event": "init", "data": {'mesage': 'hello server!'}})
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
    process.socket_connect()
    # print "Waiting for a while"
    # time.sleep(10)
    # process.terminate()
    # time.sleep(3)
    # print "Child process state: %d" % process.is_alive()