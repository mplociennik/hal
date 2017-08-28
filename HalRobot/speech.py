#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import urllib2
import md5
import time
import voicerss_tts
import multiprocessing
from audio import Audio

API_KEY = '481c2544951b469db5ef701015479b2e'
SPEECH_DIR_NAME = 'speech'
VOICES_DIR_NAME = '{0}/voices'.format(SPEECH_DIR_NAME)

class Speech(multiprocessing.Process):
    """Class to making connection to voice webapi."""

    language = 'en-us'
    format= 'wav'
    rate = '44khz_16bit_stereo'
    ssl='false'
    b64='false'
        
    def __init__(self, name=None, region=None):
        if not os.path.isdir(SPEECH_DIR_NAME):
            os.mkdir(SPEECH_DIR_NAME)
        if not os.path.isdir(VOICES_DIR_NAME):
            os.mkdir(VOICES_DIR_NAME)

        multiprocessing.Process.__init__(self)
        self.exit = multiprocessing.Event()
        
    def terminate(self):
        self.exit.set() 
        
    def hello(self, text):
        self.create_voice(text)

    def filter_spaces(self, text):
        return text.replace(" ", "%20")

    def create_voice(self, text):
        print 'creating voice...'
        # try:
        voice = voicerss_tts.speech({
            'key': API_KEY,
            'hl': self.language,
            'src': text,
            'r': '0',
            'c': self.format,
            'f': self.rate,
            'ssml': self.ssl,
            'b64': self.b64
        })

        m = md5.new()
        m.update(text)
        textHash = m.hexdigest()
        fileNamePath = '{0}/{1}.{2}'.format(VOICES_DIR_NAME,textHash, self.format)
        filename = self.write_voice(fileNamePath,  voice['response'])
        #     print(filename)
        # except:
        #     print "Speech: ERROR!"
        return fileNamePath

    def write_voice(self, fileNamePath, voice_binary):
        # try:
        with open(fileNamePath, 'wb') as f:
            f.write(voice_binary)
            f.close()
        # except:
        # print('Cannot create file "{0}"'.format(fileNamePath))
        return fileNamePath

    def say_dalek_voice(self, text):
        fileNamePath = self.create_voice(text)
        time.sleep(0.001)
        os.system('play {0} stretch 1.2 133.33 lin 0.2 0.4 \
        overdrive 30 30 echo 0.4 0.8 15 0.8 \
        synth sine fmod 30 echo 0.8 0.8 29 0.8'.format(fileNamePath))

    def play_sound(self, file):
        Audio(file, 1.0)

    def say(self, text):
        fileNamePath = self.create_voice(text)
        self.play_sound(fileNamePath)

if __name__ == "__main__":
    speech = Speech()
    speech.say_dalek_voice("Hi, I am Hal. I am from future and I want to help in human life. I have distributed system who is responsible for speech, move, home protect and control inteligent home. How Can I help You?")
