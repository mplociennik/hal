import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

PIR_SENSOR = 26
GPIO.setup(PIR_SENSOR, GPIO.IN, GPIO.PUD_DOWN)


class HomeProtectProcess(multiprocessing.Process):
    
    current_state = 0
    def __init__(self):
        multiprocessing.Process.__init__(self)
        
    def start(self, ws):
        self.ws = ws
        time.sleep(2)
        while not self.exit.is_set():
            self.watch()
        print "Pir detection stoped!"

    def watch():
        print("PIR sensor listening...")
        while True:
            try:
                time.sleep(0.1)
                current_state = GPIO.input(PIR_SENSOR)
                if current_state == 1:
                  print("Move detected!")
                  time.sleep(2)
            except KeyboardInterrupt:
                GPIO.cleanup()