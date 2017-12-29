#!/usr/bin/env python
# -*- coding: utf-8 -*-
import websocket
import time
import json
import requests

WEBSOCKET_HOST = 'ws://5.104.255.112:8083/'


class RobotWebsocketClient():

    ws = None
    WEBSOCKET_CLIENT_NAME = "default"
    def __init__(self, ):
        pass

    def on_error(self, ws, error):
        print("Socket connection error.")
        print(error)
        self.reconnect()

    def on_close(self, ws):
        print("Socket connection closed.")
        self.reconnect()

    def on_open(self, ws):
        initMessage = json.dumps({"from": self.WEBSOCKET_CLIENT_NAME, "to": "server", "event": "init", "data": {'mesage': 'hello server!'}})
        ws.send(initMessage)

    def check_connection(self):
        state = False
        try:
            requests.get('http://cieniu.pl')
            state = True
        except requests.ConnectionError as err:
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

    '''def get_server_host(self):
        print('Geting server host...')
        requests.post
    '''

    def start(self):
        count = 0
        while self.check_connection() == False:
            count = count + 1
            print("Not found connetion network! Reconnecting ({0})in 15 seconds...".format(count))
            time.sleep(15)

        print('Connection enabled! Starting socket client...')
        self.connect()
