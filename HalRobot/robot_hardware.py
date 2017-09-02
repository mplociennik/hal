#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import time
import json
import platform
from robot_websocket_client import RobotWebsocketClient

if platform.system() == 'Linux':
    from pi_hardware import PiHardware


class RobotHardware(RobotWebsocketClient):


    def __init__(self):
        self.pi_hardware = PiHardware()

    def measure_temp(self, ws):
        temp = self.pi_hardware.measure_temp()
        message = json.dumps({"client": "robotHardware", "event": "responseMeasureTemp", "data": {'result': temp}})
        ws.send(message)

    def measureVolts(self, ws):
        result = self.pi_hardware.measure_volts()
        message = json.dumps({"client": "robotHardware", "event": "responseMeasureVolts", "data": {'result': result}})
        ws.send(message)

    def measureAll(self, ws):
        volts = self.pi_hardware.measure_volts()
        temp = self.pi_hardware.measure_temp()
        message = json.dumps({"client": "robotHardware", "event": "robotHardwareInfo", "data": {'volts': volts, 'temp':temp}})
        ws.send(message)

    def on_message(self, ws, message):
        print('json message: ', message)
        dataObj = json.loads(message)
        print("Received message: {0}".format(dataObj))
        if dataObj['event'] == 'measureTemp':
            self.measure_temp(ws)
        if dataObj['event'] == 'measureVolts':
            self.measure_volts(ws)
        if dataObj['event'] == 'robotHardware':
            self.measure_volts(ws)
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])

    def on_open(self, ws):
        print('Sending initial request to HalServer')
        initMessage = json.dumps({"client": "robotHardware", "event": "init", "data": {'mesage': 'hello server!'}})
        ws.send(initMessage)

    def start(self):
        count = 0
        while self.check_connection() == False:
            count = count + 1
            print("Not found connetion network! Reconnecting ({0})in 15 seconds...".format(count))
            time.sleep(15)

        print('Connection enabled! Starting socket client...')
        self.connect()


if __name__ == "__main__":
    robot_hardware = RobotHardware()
    robot_hardware.start()