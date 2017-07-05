# -*- coding: utf-8 -*-
import sys
import json
import platform
import hashlib
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
if platform.system() == 'Linux':
    from pymove import PyMove

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
        print("protect_home state: {0}".format(state))
        dataObj = {'event':'protectHome', 'data': {'state': True}}
        self.broadcastByClientType('protectHome', json.dumps(data))

    def serveHalClient(self, dataObj):
        if dataObj['event'] == 'init':
            self.client_type = dataObj['client']
            response = json.dumps({'event': 'message' , 'data':{'message': 'Init ready!'}})           
        if dataObj['event'] == 'message':
            response = json.dumps({'event': 'message' , 'data':{'message': 'Hal Server received message.'}})   
        if dataObj['event'] == 'move':
            response = self.move(dataObj['data']['direction'], dataObj['data']['state'])
        if dataObj['event'] == 'protectHome':
            response = self.protect_home(dataObj['data']['state'])
        return response

    def serveProtectHome(self, dataObj):
        if dataObj['event'] == 'init':
            self.client_type = dataObj['client']
            print('ProtectHomeClient initialized: {0}'.format(self.client_type))
            response = json.dumps({'event': 'message' , 'data': {'message': 'Init ready!'}})     
        if dataObj['event'] == 'message':
            print("Message from homeProtect: {}".format(datObj['data']['message']))
            response = 'Hal server received Your message.'
        if dataObj['event'] == 'alarm':
            print('Alarm alarm alarm!')
            response = 'Hal server received Your alarm message.'
        return response

    def broadcastByClientType(self, client_type, data):
        for client in clients:
            if client.client_type == client_type:
                client.sendMessage(data)

    def checkValidMessage(self, message):
        state = True
        if message.get('client') == None:
            print('Message haven\'t client value!')
            state = False
        if message.get('event') == None:
            print('Message haven\'t event value!')
            state = False
        return state

    def decode_message(self, message):
        decoded_message = json.loads(message, 'utf-8')
        return decoded_message

    def handleMessage(self):
        dataObj = self.decode_message(self.data)
        if self.checkValidMessage(dataObj):
            print('*'*80)
            print('')
            print('Handling message...')
            print('')
            print('Client: {0}'.format(dataObj['client']))
            print('Event: {0}'.format(dataObj['event']))
            print('Data: {0}'.format(dataObj['data']))
            print('*'*80)
            try:
                response = 'Bad command!'
                print('dataobj: {0}'.format(dataObj))
                if dataObj['client'] == 'halClient':
                    response = self.serveHalClient(dataObj)
                if dataObj['client'] == 'protectHome':
                    response = self.serveProtectHome(dataObj)
                self.sendMessage(response.decode("utf-8"))
            except:
                print('Cannot handle message: {0}'.format(response))
        else:
            responseMessage = 'Message validation error!'
            print(responseMessage)
            response = response = json.dumps({'event': 'message' , 'data':{'message': responseMessage}})    
            self.sendMessage(response.decode("utf-8"))

    def handleConnected(self):
        try:
            uid = hashlib.sha512()
            uid.update(self.address[0] + self.address[0])
            self.uid = uid.hexdigest()
            # self.uid = 'dupa'
            print('Client connected - address: {0}, uid: {1}.'.format(self.address, self.uid))
            clients.append(self)
        except:
            print('Connection error...')

    def handleClose(self):
        clients.remove(self)
        print(self.address, 'closed')

server = SimpleWebSocketServer('', 8083, HalEcho)
print('Server listening...')
try:
    server.serveforever()
except:
    print 'Server closed...'