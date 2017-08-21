#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import urllib2
import pyvona
import multiprocessing
from audio import Audio


IVONA_ACCESS_KEY = 'GDNAIKZKKGPM3SPFPZGA'
IVONA_SECRET_KEY = 'PXnXmq3aV1qYsV4jxG4WtoVhESq4gZaXGjrDTBke'

class Speech(multiprocessing.Process):
    """Class to making connection to voice webapi."""

    name = 'Joey'
    region = 'eu-east'
        
    def __init__(self, name=None, region=None):
        multiprocessing.Process.__init__(self)
        self.exit = multiprocessing.Event()
        if name:
            self.name = name
        if region:
            self.region = region
        
    def terminate(self):
        self.exit.set() 
        
    def hello(self, text):
        self.create_voice(text)

    def filter_spaces(self, text):
        return text.replace(" ", "%20")

    def create_voice(self, text):
        print 'creating voice'
        v = pyvona.create_voice(IVONA_ACCESS_KEY, IVONA_SECRET_KEY)
        v.voice_name = self.name
        v.region = self.region
        try:
            v.speak(text)
        except:
            print "Speech: connection not found!"

    def create_dalek_voice(self, text):
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

    def play_sound(self, file):
        Audio(file, 1.0)

if __name__ == "__main__":
    speech = Speech()
    speech.hello('Hello world!')
