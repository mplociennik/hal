import picamera

camera = picamera.PiCamera()
camera.start_preview()
camera.start_recording('video.h264')