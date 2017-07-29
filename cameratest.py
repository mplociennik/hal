from picamera import PiCamera
from time import sleep

sleep(5)
camera = PiCamera()
# camera.resolution = (2592, 1944)
camera.capture('/home/pi/Desktop/image.jpg')