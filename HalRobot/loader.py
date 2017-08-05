import os
import time

LOADER_ENABLED = True

if LOADER_ENABLED:
    time.sleep(5)
    robot_move = os.popen('python /home/pi/hal/HalRobot/robot_move.py')
    time.sleep(1)
    home_protect = os.popen('python /home/pi/hal/HalRobot/robot_home_protect.py')
    time.sleep(1)
    autopilot = os.popen('python /home/pi/hal/HalRobot/robot_autopilot.py')
    time.sleep(1)
    robot_camera = os.popen('python /home/pi/hal/HalRobot/robot_camera.py')
    time.sleep(1)
else:
    print('Loader is disabled!')