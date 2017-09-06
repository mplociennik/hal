#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time
import platform
import threading
import json
from robot_websocket_client import RobotWebsocketClient
if platform.system() == 'Linux':
    from pymove import PyMove
    from distance import Distance


class RobotAutopilot(RobotWebsocketClient):

    DIST_TOLERANCE = 4
    OBSTACLE_DISTANCE = 50
    AUTOPILOT_ENABLED = False
    WEBSOCKET_CLIENT_NAME = "robotAutopilot"

    def __init__(self, ):
        pass

    def toggle_autopilot(self, state):
        print("toggle autopilot state: {0}".format(state))
        if state:
            self.AUTOPILOT_ENABLED = True
            print("autopilot state: {0}".format(self.AUTOPILOT_ENABLED))
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
            last_distance = int(cm)
            
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

    def on_message(self, ws, message):
        dataObj = json.loads(message)
        print("Received server message: {0}".format(dataObj))
        if dataObj['event'] == 'autopilot':
            self.toggle_autopilot(dataObj['data']['state'])
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])

        
if __name__ == "__main__":
    autopilot = RobotAutopilot()
    autopilot.start()