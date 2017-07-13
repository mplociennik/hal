#!/bin/sh 
# test
cd /
cd home/pi/hal
#update scripts
git pull
# robot move
sudo python robot_move.py &
# home protect
sudo python home_protect.py &
