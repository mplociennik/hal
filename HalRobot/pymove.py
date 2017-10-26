#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time
import serial
from multiprocessing import Process, Queue

# command to show connections: ls /dev/tty*
ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=.1)


class PyMove():
    """
    For controlling motors by serial port in arduino.
    """

    def __init__(self):
        self.data = []

    def display_text(self, text):
        print(text)
        return

    def run_forward(self):
        text = "Forward Start"
        self.display_text(text)
        ser.write('1')

    def run_backward(self):
        text = "DOWN Start"
        self.display_text(text)
        ser.write('2')

    def run_left(self):
        text = "LEFT Start"
        self.display_text(text)
        ser.write('3')

    def run_right(self):
        text = "RIGHT Start"
        self.display_text(text)
        ser.write('4')

    def stop_motors(self):
        text = "Stop motors"
        self.display_text(text)
        ser.write('0')

    def receiver(self):
        while True:
            req = ser.readline()
            if req:
                print(req)
            

if __name__ == '__main__':
    move = PyMove()
    queue = Queue()
    p = Process(target=move.receiver, args=())
    p.start()
    p.join()
    print(ser.name)    
    move.run_forward()
    time.sleep(2)
    move.stop_motors()
