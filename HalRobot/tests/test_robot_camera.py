import unittest
import os
import datetime
from robot_camera import RobotCamera

 
class TestRobotCamera(unittest.TestCase):
 
    def setUp(self):
        self.robot_camera = RobotCamera()
        pass
 
    def test_receive_commands(self):
        self.assertEqual( multiply(3,4), 12)
 
    def test_create_photo(self):
        phoo_object = self.robot_camera.get_photo()
        self.assertTrue( os.path.isfile(photo_object.name))

    def test_send_photo(self):
        self.assertEqual( multiply('a',3), 'aaa')
 
if __name__ == '__main__':
    unittest.main()