import picamera

camera = picamera.PiCamera()
camera.resolution = (640, 480)
camera.start_preview()
# camera.start_recording('/home/pi/Desktop/my_video.h264')
# camera.wait_recording(60)
# camera.stop_recording()