import os
import time

robot_move = os.popen('python /home/pi/hal/robot_move.py')
home_protect = os.popen('python /home/pi/hal/home_protect.py')
autopilot = os.popen('python /home/pi/hal/autopilot.py')
robot_camera = os.popen('python /home/pi/hal/robot_camera.py')