#!/bin/sh 
# test

#update scripts
git pull
# robot move
python robot_move.py &
# home protect
python home_protect.py &
