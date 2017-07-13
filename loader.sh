#!/bin/sh 
# test
cd /
cd home/pi/hal

#update scripts
git pull

# robot move
sudo python robot_move.py & > robot_move.log

# home protect
sudo python home_protect.py & > home_protect.log
