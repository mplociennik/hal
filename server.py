# -*- coding: utf-8 -*-
import sys
import json
import platform
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

if platform.system() == 'Linux':
    from pymove import PyMove

class HalEcho(WebSocket):


    def move(self, direction, state):
        response = 'Direction: {0}, State {1}'.format(direction, state)
        print response
        if platform.system() == 'Windows':
            return response
        if "up" in direction:
            if state:
                print('state true go up')
                PyMove().run_up_start()
            else:
                PyMove().run_up_stop()
            response = 'Move UP state: {0}'.format(state)     
        if 'down' in direction:
            PyMove().run_down_start() if state else PyMove().run_down_stop()
            response = 'Move DOWN state: {0}'.format(state)
        if 'left' in direction:
            PyMove().run_left_start() if state else PyMove().run_left_stop()
            state = 'Move LEFT state: {0}'.format(state)        
        if 'right' in direction:
            PyMove().run_right_start() if state else move.run_right_stop()
            state = 'Move RIGHT state: {0}'.format(state)
        return state

    def protect_home(self):
        pass

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

print('Server listening...')
server.serveforever()