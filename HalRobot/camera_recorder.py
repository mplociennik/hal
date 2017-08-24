import picamera
import time

camera = picamera.PiCamera()

camera.start_preview()
time.sleep(30)
camera.stop_preview()
# camera.start_recording('/home/pi/Desktop/my_video.h264')
# camera.wait_recording(60)
# camera.stop_recording()