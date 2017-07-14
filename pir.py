import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

pir_sensor = 26

GPIO.setup(pir_sensor, GPIO.IN, GPIO.PUD_DOWN)

current_state = 0
print("PIR sensor listening...")
while True:
    try:
        time.sleep(0.1)
        current_state = GPIO.input(pir_sensor)
        if current_state == 1:
          print("GPIO pin %s is %s" % (pir_sensor, current_state))
          time.sleep(1) # wait 4 seconds for PIR to reset. 
        else:
            print("Not detected movement.")
    except KeyboardInterrupt:
        GPIO.cleanup()