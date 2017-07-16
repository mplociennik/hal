# -*- coding: utf-8 -*-
import sys
import time
import json
import platform
import websocket
import urllib2
if platform.system() == 'Linux':
    from pymove import PyMove

WEBSOCKET_HOST = 'ws://192.168.1.151:8083/'

class RobotMove():
    ''' not working websocket connection after alarm '''
    def __init__(self):
        pass

    def move(self, direction, state):
        response = json.dumps({'event': 'message','data': {'message': 'Direction: {0}, State: {1}'.format(direction, state)}})
        print response
        if platform.system() == 'Windows':
            return response
        if "up" in direction:
            if state:
                PyMove().run_up_start()
            else:
                PyMove().run_up_stop()
            response = json.dumps({'event': 'move' ,'data': {'message': 'Move UP state: {0}'.format(state)}})             
        if 'down' in direction:
            if state:
                PyMove().run_down_start()  
            else:
                PyMove().run_down_stop()
            response = json.dumps({'event': 'move' ,'data': {'message': 'Move DOWN state: {0}'.format(state)}})
        if 'left' in direction:
            if state:
                PyMove().run_left_start()
            else:
                PyMove().run_left_stop()
            response = json.dumps({'event': 'move' ,'data': {'message': 'Move LEFT state: {0}'.format(state)}})   
        if 'right' in direction:
            if state:
                PyMove().run_right_start() 
            else:
                PyMove().run_right_stop()
            response = json.dumps({'event': 'move' ,'data': {'message': 'Move RIGHT state: {0}'.format(state)}})            
        return response

    def on_message(self, ws, message):
        dataObj = json.loads(message)
        print("Received message: {0}".format(dataObj))
        if dataObj['event'] == 'move':
            self.move(dataObj['data']['direction'], dataObj['data']['state'])
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])

    def on_error(self, ws, error):
        print(error)

    def on_close(self, ws):
        print("### connection closed ###")

    def on_open(self, ws):
        print('Sending initial request to HalServer')
        initMessage = json.dumps({"client": "robotMove","event": "init", "data": {'mesage': 'hello server!'}})
        ws.send(initMessage)

    def check_connection(self):
        state = False
        try:
            urllib2.urlopen('http://cieniu.pl', timeout=1)
            state = True
        except urllib2.URLError as err: 
            state = False
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

        print('Connection enabled! Starting socket client...')
        self.connect()

if __name__ == "__main__":
    robot_move = RobotMove()
    robot_move.start()