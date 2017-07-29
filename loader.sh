#!/bin/sh 

cd /
cd home/pi/hal

#update scripts
git pull

# robot move
python robot_move.py

# autopilot
python autopilot.py

# home protect
python home_protect.py

# robot camera
python robot_camera.py

