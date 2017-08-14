#!/usr/bin/env python2
#encoding: utf-8
import platform
from time import sleep

if platform.system() == 'Linux':
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BOARD)
    SIGNAL_PIN = 3
    GPIO.setup(SIGNAL_PIN,GPIO.OUT)
    GPIO.output(SIGNAL_PIN, False)

try:
    while True:
        GPIO.output(SIGNAL_PIN, True)
        sleep(2)
        GPIO.output(SIGNAL_PIN, False)
        sleep(2)
        GPIO.output(SIGNAL_PIN, True)
        sleep(2)
        GPIO.output(SIGNAL_PIN, False)
        sleep(2)

except KeyboardInterrupt:
    GPIO.cleanup()  # clean up GPIO on CTRL+C exit
GPIO.cleanup()


