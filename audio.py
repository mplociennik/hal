#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pygame as pg

class Audio:
    volume = 1.0
    def __init__(self, music_file=None, volume=None):
        if volume is not None:
            self.volume = volume
        if music_file is not None:
            self.music_file = music_file
            self.play_music(self.music_file, self.volume)

    def play_music(self, music_file, volume=0.8):
        freq = 44100
        bitsize = -16
        channels = 2
        buffer = 2048
        pg.mixer.init(freq, bitsize, channels, buffer)
        pg.mixer.music.set_volume(volume)
        clock = pg.time.Clock()
        try:
            pg.mixer.music.load(music_file)
            print("Music file {} loaded!".format(music_file))
        except pg.error:
            print("File {} not found! ({})".format(music_file, pg.get_error()))
            return
        pg.mixer.music.play()
        while pg.mixer.music.get_busy():
            clock.tick(30)
        return True

if __name__ == "__main__":
    music_file = "sounds/Processing_R2D2.mp3"
    volume = 0.9
    audio = Audio(music_file, volume)