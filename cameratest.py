from picamera import PiCamera
from time import sleep

camera = PiCamera()

camera.capture('/home/pi/Desktop/image.jpg')

camera.start_recording('/home/pi/video.h264')
sleep(10)
camera.stop_recording()