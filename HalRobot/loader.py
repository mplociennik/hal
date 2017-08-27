import os
from time import sleep
from robot_hardware import RobotHardware

LOADER_ENABLED = True

if LOADER_ENABLED:
    robot_hardware = RobotHardware()
    print robot_hardware.disable_hdmi()
    sleep(5)
    print('Running robot modules...')
    robot_move = os.system('python /home/pi/hal/HalRobot/robot_move.py')
    sleep(1)
    home_protect = os.system('python /home/pi/hal/HalRobot/robot_home_protect.py')
    sleep(1)
    autopilot = os.system('python /home/pi/hal/HalRobot/robot_autopilot.py')
    sleep(1)
    robot_camera = os.system('python /home/pi/hal/HalRobot/robot_camera.py')
    sleep(1)
    robot_speech = os.system('python /home/pi/hal/HalRobot/robot_speech.py')
    sleep(1)
else:
    print('Loader is disabled!')