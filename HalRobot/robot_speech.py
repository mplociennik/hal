# -*- coding: utf-8 -*-
import sys
import time
import json
import platform
import websocket
import urllib2

if platform.system() == 'Linux':
    import speech

class RobotSpeech():

    