#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import urllib2
import md5
import base64
import voicerss_tts
import multiprocessing
from audio import Audio

API_KEY = '481c2544951b469db5ef701015479b2e'
SPEECH_DIR_NAME = 'speech'
VOICES_DIR_NAME = '{0}/voices'.format(SPEECH_DIR_NAME)

class Speech(multiprocessing.Process):
    """Class to making connection to voice webapi."""

    language = 'en-us'
        
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

    def create_voice(self, text, lang=language, format='mp3', rate='44khz_16bit_stereo', ssl='false', b64='true'):
        print 'creating voice...'
        # try:
        voice = voicerss_tts.speech({
            'key': API_KEY,
            'hl': lang,
            'src': text,
            'r': '0',
            'c': format,
            'f': rate,
            'ssml': ssl,
            'b64': b64
        })
        print('<audio src="' + voice['response'] + '" autoplay="autoplay"></audio>')
        m = md5.new()
        m.update(text)
        textHash = m.hexdigest()
        fileNamePath = '{0}/{1}.{2}'.format(VOICES_DIR_NAME,textHash, format)
        filename = self.write_voice(fileNamePath,  base64.b64decode(voice['response']))
        #     print(filename)
        # except:
        #     print "Speech: ERROR!"

    def write_voice(self, fileNamePath, voice_binary):
        # try:
        with open(fileNamePath, 'w') as f:
            f.write(voice_binary)
            f.close()
        # except:
        # print('Cannot create file "{0}"'.format(fileNamePath))
        return fileNamePath

    def play_sound(self, file):
        Audio(file, 1.0)

if __name__ == "__main__":
    speech = Speech()
    speech.hello('Hello world man! How are you?')
