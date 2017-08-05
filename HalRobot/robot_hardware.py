#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import subprocess


class RobotHardware():

    def get_temperature(self):
        command_response = subprocess.check_output('/opt/vc/bin/vcgencmd measure_temp',shell=True, stderr=subprocess.STDOUT)
        return command_response

if __name__ == "__main__":
    robot_hardware = RobotHardware()
    robot_hardware.get_temperature()