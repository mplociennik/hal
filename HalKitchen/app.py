#!/usr/bin/env python2
#encoding: utf-8

from time import sleep
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
SIGNAL_PIN = 2
GPIO.setup(SIGNAL_PIN,GPIO.OUT)
GPIO.output(SIGNAL_PIN, False)

class KitchenController():

    def light(self, state):
        print('Light {0}!'.format(state))
        GPIO.output(SIGNAL_PIN, state)

if __name__ == "__main__":
    try:
        kitchen_controller = KitchenController()
        while True:
            kitchen_controller.light(1)
            sleep(2)
            kitchen_controller.light(0)
            sleep(2)
    except KeyboardInterrupt:
            print "interrupt"
    finally:
        GPIO.cleanup()


