#!/usr/bin/env python
# -*- coding: utf-8 -*-
import multiprocessing
import time
from speech import Speech
from distance import Distance


class HomeProtectProcess(multiprocessing.Process):

    DIST_TOLERANCE = 4
    def __init__(self, ):
        multiprocessing.Process.__init__(self)
        self.exit = multiprocessing.Event()
        self.INITIAL_DISTANCE = int(Distance().detect())
            
    def start(self):
        while not self.exit.is_set():
            self.watch()
        print "Protection stoped!"

    def terminate(self):
        print "Terminating protection..."
        self.exit.set()

    def detect_opened_door(self, distance):
        sub = distance - self.INITIAL_DISTANCE
        return sub <= self.DIST_TOLERANCE

    def watch(self):
        distance = Distance()
        cm = distance.detect()
        print int(cm)
        if self.detect_opened_door(int(cm)):
            self.alarm()

    def alarm(self):
        print 'Exterminate! Exterminate! Exterminate!'

if __name__ == "__main__":
    process = HomeProtectProcess()
    process.start()
    print "Waiting for a while"
    time.sleep(3)
    process.terminate()
    time.sleep(3)
    print "Child process state: %d" % process.is_alive()