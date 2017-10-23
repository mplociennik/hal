#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time
import serial

# command to show connections: ls /dev/tty*
ser = serial.Serial('/dev/ttyUSB0', 9600)


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
        ser.write('motor_forward')

    def run_backward(self):
        text = "DOWN Start"
        self.display_text(text)
        ser.write('motor_backward')

    def run_left(self):
        text = "LEFT Start"
        self.display_text(text)
        ser.write('motor_left')

    def run_right(self):
        text = "RIGHT Start"
        self.display_text(text)
        ser.write('motor_right')

    def stop_motors(self):
        text = "Stop motors"
        self.display_text(text)
        ser.write('motor_stop')

    def callback_data(self):
        # create maybe next time...
        while True:
            print(ser.readline())


if __name__ == '__main__':
    move = PyMove()
    time.sleep(1)
    move.run_forward()
    time.sleep(1)
    move.run_backward()
    time.sleep(1)
    move.run_stop_motors()
