#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import subprocess
from time import sleep


class RobotHardware():

    def measure_temp(self):
        command_response = subprocess.check_output('vcgencmd measure_temp',shell=True, stderr=subprocess.STDOUT)
        return command_response    

    def measure_volts(self):
        command_response = subprocess.check_output('vcgencmd measure_volts',shell=True, stderr=subprocess.STDOUT)
        return command_response

    def disable_hdmi(self):
        command_response = subprocess.check_output('tvservice -o',shell=True, stderr=subprocess.STDOUT)
        return command_response

    def enable_hdmi(self):
        command_response = subprocess.check_output('tvservice -p',shell=True, stderr=subprocess.STDOUT)
        return command_response


if __name__ == "__main__":
    print robot_hardware.measure_temp()
    print robot_hardware.measure_volts()