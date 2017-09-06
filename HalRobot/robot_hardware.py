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

    WEBSOCKET_CLIENT_NAME = "robotHardware"

    def __init__(self):
        self.pi_hardware = PiHardware()

    def measure_temp(self, ws, request):
        temp = self.pi_hardware.measure_temp()
        message = json.dumps({"from": self.WEBSOCKET_CLIENT_NAME, "to": request['from'], "event": "responseMeasureTemp", "data": {'result': temp}})
        ws.send(message)

    def measureVolts(self, ws, request):
        result = self.pi_hardware.measure_volts()
        message = json.dumps({"from": self.WEBSOCKET_CLIENT_NAME, "to": request['from'], "event": "responseMeasureVolts", "data": {'result': result}})
        ws.send(message)

    def measure_all(self, ws, request):
        volts = self.pi_hardware.measure_volts()
        temp = self.pi_hardware.measure_temp()
        message = json.dumps({"from": self.WEBSOCKET_CLIENT_NAME, "to": request['from'], "event": "robotHardwareInfo", "data": {'volts': volts, 'temp':temp}})
        ws.send(message)

    def on_message(self, ws, message):
        print('json message: ', message)
        dataObj = json.loads(message)
        print("Received message: {0}".format(dataObj))
        if dataObj['event'] == 'measureTemp':
            self.measure_temp(ws, dataObj)
        if dataObj['event'] == 'measureVolts':
            self.measure_volts(ws, dataObj)
        if dataObj['event'] == 'robotHardware':
            self.measure_all(ws, dataObj)
        if dataObj['event'] == 'message':
            print(dataObj['data']['message'])


if __name__ == "__main__":
    robot_hardware = RobotHardware()
    robot_hardware.start()