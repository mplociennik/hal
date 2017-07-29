import os
import time

time.sleep(5)
robot_move = os.popen('python /home/pi/hal/robot_move.py')
time.sleep(1)
home_protect = os.popen('python /home/pi/hal/home_protect.py')
time.sleep(1)
autopilot = os.popen('python /home/pi/hal/autopilot.py')
time.sleep(1)
robot_camera = os.popen('python /home/pi/hal/robot_camera.py')
time.sleep(1)