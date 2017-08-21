#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import time
import pyvona

IVONA_ACCESS_KEY = 'GDNAIKZKKGPM3SPFPZGA'
IVONA_SECRET_KEY = 'PXnXmq3aV1qYsV4jxG4WtoVhESq4gZaXGjrDTBke'

name = 'Jacek'
region = 'eu-east'
text = "Exterminate, exterminate, exterminate!"
v = pyvona.create_voice(IVONA_ACCESS_KEY, IVONA_SECRET_KEY)
v.voice_name = name
v.region = region
try:
    v.fetch_voice(text, 'voice_file')
except:
    print "Speech: connection not found!"
    
time.sleep(0.001)
os.system('play tmp/recorder.wav stretch 1.2 133.33 lin 0.2 0.4 \
overdrive 30 30 echo 0.4 0.8 15 0.8 \
synth sine fmod 30 echo 0.8 0.8 29 0.8')
