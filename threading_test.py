import threading
import time

watch_alarm_state = False
def watch_alarm():
    while watch_alarm_state:
        print("dupa")
    print("dupa stop")

watch_alarm_state = True
t = threading.Thread(target=watch_alarm)
# t.setDaemon(True)
t.start()
time.sleep(2)
watch_alarm_state = False