# -*- coding: utf-8 -*-
import sys
import json
import platform
import hashlib
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
if platform.system() == 'Linux':
    from pymove import PyMove
    # try:
    #     from home_protect import HomeProtectProcess
    # except:
    #     print('kurwa nie dziala')

clients = [];

class HalEcho(WebSocket):
    ''' do not create init function here'''
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

    def protect_home(self, state):
        if state:
            response = json.dumps({'event': 'protectHome' ,'data': {'state': True, 'message': 'Home protection enabled!'}})  
            # if platform.system() == 'Linux':
            #     self.home_protect_process.start(self)      
        else:
            response = json.dumps({'event': 'protectHome' ,'data': {'state': False, 'message': 'Home protection disabled!'}})   
            # if platform.system() == 'Linux':
            #     self.home_protect_process.terminate()
        return response

    def handleMessage(self):
        try:
            response = 'Bad command!'
            dataObj = json.loads(self.data)
            if dataObj['client'] == 'halClient':
                response = this.serveHalClient(dataObj)
            if dataObj['client'] == 'protectHome':
                response = self.serveProtectHome(dataObj)
            self.sendMessage(response.decode("utf-8"))
        except:
            print('Cannot handle message: {0}'.format(response))

    def handleConnected(self):
        try:
            # uid = hashlib.sha512()
            # uid.update(self.address)
            # self.uid = uid.hexdigest()
            print(self.address, 'connected')
            clients.append(self)
        except:
            print('Connection error...')

    def handleClose(self):
        clients.remove(self)
        print(self.address, 'closed')

    def serveHalClient(self, dataObj):
        if dataObj['event'] == 'init':
            self.client_type = dataObj['client']
            print dataObj
            response = json.dumps({'event': 'message' , 'message': 'Init ready!'})           
        if dataObj['event'] == 'message':
            print dataObj
            response = json.dumps({'event': 'message' , 'message': 'Hal Server received message.'})   
        if dataObj['event'] == 'move':
            response = self.move(dataObj['data']['direction'], dataObj['data']['state'])
        return response

    def serveProtectHome(self, dataObj):
        if dataObj['event'] == 'init':
            self.client_type = dataObj['client']
            print('ProtectHomeClient initialized: {}'.format(self.client_type))
            response = json.dumps({'event': 'message' , 'message': 'Init ready!'})     
        if dataObj['event'] == 'protectHome':
                response = self.protect_home(dataObj['data']['state'])
        if dataObj['event'] == 'message':
            response = 'Hal server received Your message.'
        if dataObj['event'] == 'alarm':
            response = 'Hal server received Your message.'
        return response

    def broadcastByClientType(self, client_type, data):
        for client in clients:
            if client.client_type == client_type:
                client.sendMessage(data)

server = SimpleWebSocketServer('', 8083, HalEcho)
print('Server listening...')
try:
    server.serveforever()
except:
    print 'Server closed...'