import picamera

camera = picamera.PiCamera()
camera.start_preview()
camera.start_recording('video.h264')

try:
    camera = picamera.PiCamera()
    camera.start_preview()
    camera.start_recording('video.h264')
except KeyboardInterrupt:
    raise
except:
    camera.stop_recording()