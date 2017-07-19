#!/bin/sh 

cd /
cd home/pi/hal

#update scripts
git pull

# home protect
python home_protect.py &

# robot move
python robot_move.py &


