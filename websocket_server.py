# -*- coding: utf-8 -*-
import sys
import json
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from pymove import PyMove

class HalEcho(WebSocket):


    def move(self, direction, state):
        state = 'Direction: {0}, State {1}'.format(direction, state)
        print state
        if "up" in direction:
            move = Pymove()
            move.run_up_start() if state else move.run_up_stop()
            state = 'Move UP state: {0}'.format(state)        
        if 'down' in direction:
            move = Pymove()
            move.run_down_start() if state else move.run_down_stop()
            state = 'Move DOWN state: {0}'.format(state)
        if 'left' in direction:
            move = Pymove()
            move.run_left_start() if state else move.run_left_stop()
            state = 'Move LEFT state: {0}'.format(state)        
        if 'right' in direction:
            move = Pymove()
            move.run_right_start() if state else move.run_right_stop()
            state = 'Move RIGHT state: {0}'.format(state)
        return state

    def handleMessage(self):
        response = 'Bad command!'
        dataObj = json.loads(self.data)
        if dataObj['event'] == 'move':
            response = self.move(dataObj['data']['direction'], dataObj['data']['state'])
        self.sendMessage(response.decode("utf-8"))

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('', 8083, HalEcho)
server.serveforever()