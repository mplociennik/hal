#!/bin/sh 

# robot move
python /home/pi/hal/robot_move.py &
# home protect
python /home/pi/hal/home_protect.py &
