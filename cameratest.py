from picamera import PiCamera
from time import sleep

camera = PiCamera()
# camera.resolution = (2592, 1944)
camera.capture('/home/pi/Desktop/image.jpg')

camera.start_recording('/home/pi/Desktop/video.h264')
sleep(10)
camera.stop_recording()