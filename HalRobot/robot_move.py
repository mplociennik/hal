#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import time
import json
import platform
from robot_websocket_client import RobotWebsocketClient
if platform.system() == 'Linux':
    from pymove import PyMove


class RobotMove(RobotWebsocketClient):

    WEBSOCKET_CLIENT_NAME = "robotMove"
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
        print('json message: ', message)
        dataObj = json.loads(message)
        print("Received request: {0}".format(dataObj))
        if dataObj['event'] == 'move':
            self.move(dataObj['data']['direction'], dataObj['data']['state'])
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])


if __name__ == "__main__":
    robot_move = RobotMove()
    robot_move.start()