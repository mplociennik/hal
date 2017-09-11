#!/bin/sh
sudo raspivid -o - -t 0 -w 800 -h 400 | cvlc -vvv stream:///dev/stdin --sout '#rtp{sdp=rtsp://:8554/x}' :demux=h264 &