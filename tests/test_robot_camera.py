import unittest

 
class TestRobotCamera(unittest.TestCase):
 
    def setUp(self):
        pass
 
    def test_receive_commands(self):
        self.assertEqual( multiply(3,4), 12)
 
    def test_create_photo(self):
        self.assertEqual( multiply('a',3), 'aaa')

    def test_send_photo(self):
        self.assertEqual( multiply('a',3), 'aaa')
 
if __name__ == '__main__':
    unittest.main()