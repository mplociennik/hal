import os
import time

robot_move = os.popen('python robot_move.py')
home_protect = os.popen('python home_protect.py')
autopilot = os.popen('python autopilot.py')
robot_camera = os.popen('python robot_camera.py')