#!/usr/bin/env python
# -*- coding: utf-8 -*-
import websocket
import time
import urllib2

# WEBSOCKET_HOST = 'ws://localhost:8083/'
WEBSOCKET_HOST = 'ws://192.168.1.151:8083/'


class RobotWebsocketClient():

    ws = None
    def __init__(self, ):
        pass

    def on_error(self, ws, error):
        print("Socket connection error.")
        print(error)
        self.reconnect()

    def on_close(self, ws):
        print("Socket connection closed.")
        self.reconnect()

    def check_connection(self):
        state = False
        try:
            urllib2.urlopen('http://cieniu.pl', timeout=1)
            state = True
        except urllib2.URLError as err: 
            state = False
        print("self.check_connection() state: {0} ".format(state))
        return state

    def reconnect(self, count=None):
        reconnect_time = 5
        print('Reconnecting after {0} seconds'.format(reconnect_time))
        time.sleep(reconnect_time)
        self.start()

    def connect(self):
        print("Connecting to websocket...")
        websocket.enableTrace(True)
        self.ws = websocket.WebSocketApp(WEBSOCKET_HOST,
                          on_message = self.on_message,
                          on_error = self.on_error,
                          on_close = self.on_close)
        self.ws.on_open = self.on_open
        self.ws.run_forever()