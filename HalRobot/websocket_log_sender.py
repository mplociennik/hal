import json
from robot_websocket_client import RobotWebsocketClient
from hal_api import HalApi

class WebsocketLogSender(RobotWebsocketClient):

    WEBSOCKET_CLIENT_NAME = "websocketLogSender"

    def __init__(self):
        pass

    def post_websocket_log(self, data):
        print('data: {0}'.format(data))
        hal_api = HalApi()
        response = hal_api.post_websocket_log(data)
        print('response: {0}'.format(response))

    def on_message(self, ws, message):
        print('json message: ', message)
        dataObj = json.loads(message)
        print("Received request: {0}".format(dataObj))
        self.post_websocket_log(dataObj)


if __name__ == "__main__":
    websocket_log_sender = WebsocketLogSender()
    websocket_log_sender.start()