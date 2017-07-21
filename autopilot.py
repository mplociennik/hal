#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time
import platform
import urllib2
import threading
import json
import websocket
if platform.system() == 'Linux':
    from pymove import PyMove
    from distance import Distance

WEBSOCKET_HOST = 'ws://192.168.1.151:8083/'


class RaspieAutopilot():

    DIST_TOLERANCE = 4
    OBSTACLE_DISTANCE = 50
    AUTOPILOT_ENABLED = False
    ws = None
    def __init__(self, ):
        pass

    def toggle_autopilot(self, state):
        print("toggle autopilot state: {0}".format(state))
        if state:
            self.AUTOPILOT_ENABLED = True
            print("self.watch_alarm_state: {0}".format(self.AUTOPILOT_ENABLED))
            t = threading.Thread(target=self.autopilot_thread)
            t.setDaemon(True)
            t.start()
        else:
            self.AUTOPILOT_ENABLED = False

    def detect_no_movement(self, now_distance, last_distance):
        sub = now_distance - last_distance
        print("abs(sub): {0}".format(abs(sub)))
        return abs(sub) <= self.DIST_TOLERANCE
        
    def skip_obstacle(self):
        print "Skiping obstacle!"
        PyMove().stop_motors()
        time.sleep(1)
        PyMove().run_down_start()
        time.sleep(0.3)
        PyMove().run_down_stop()
        time.sleep(0.3)
        PyMove().run_right_start()
        time.sleep(0.3)
        PyMove().run_right_stop()
        
        
    def search_free_road(self, last_distance=None):
        text = 'Looking for free road...'
        print text
        distance = Distance()
        cm = distance.detect()
        print int(cm)
        if last_distance is not None:
            if self.detect_no_movement(int(cm), last_distance):
                self.skip_obstacle()
        if int(cm) <= self.OBSTACLE_DISTANCE:
            self.skip_obstacle()
            self.search_free_road(last_distance)
        else:
            print "Run!"
            PyMove().run_up_start()
            
    def autopilot_thread(self):
        while self.AUTOPILOT_ENABLED:
            print("autopilot driving...")
            if platform.system() == 'Linux':
                self.search_free_road()
            else:
                print("autopilot loop")
                time.sleep(1)
        print "Autopilot stoped!"

    def terminate(self):
        print "Terminating autopilot..."
        self.AUTOPILOT_ENABLED = False

    def check_connection(self):
        state = False
        try:
            urllib2.urlopen('http://cieniu.pl', timeout=1)
            state = True
        except urllib2.URLError as err: 
            state = False
        print("self.check_connection() state: {0} ".format(state))
        return state

    def on_message(self, ws, message):
        dataObj = json.loads(message)
        print("Received server message: {0}".format(dataObj))
        if dataObj['event'] == 'autopilot':
            self.toggle_autopilot(dataObj['data']['state'])
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
        initMessage = json.dumps({"client": "autopilot","event": "init", "data": {'mesage': 'hello server!'}})
        ws.send(initMessage)   

    def connect(self):
        print("Connecting to websocket...")
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
    autopilot = RaspieAutopilot()
    autopilot.start()