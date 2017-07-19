#!/bin/sh 
ENABLED = true

if [ "ENABLED" = true ] ; then
cd /
cd home/pi/hal

#update scripts
git pull

# home protect
python home_protect.py & > home_protect.log

# robot move
python robot_move.py & > robot_move.log

fi

