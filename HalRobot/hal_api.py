import requests
import multiprocessing
import json


class HalApi(multiprocessing.Process):
    API_ADDRESS = 'http://127.0.0.1:8000'
    GET_TOKEN_URL = '{0}/login_check'.format(API_ADDRESS)
    POST_WEBSOCKET_LOG_URL = '{0}/api/websocket-log'.format(API_ADDRESS)
    API_LOGIN = 'halapi'
    API_PASSWORD = ''
    JWT_PREFIX = 'JWT'

    def get_token(self):
        payload = {'_username': self.API_LOGIN, '_password': self.API_PASSWORD}
        r = requests.post(self.GET_TOKEN_URL, data=payload)
        token = None
        if r.status_code == 200:
            responseObj = json.loads(r.text)
            token = responseObj['token']
        return token

    def post_websocket_log(self, data):
        token = self.get_token()
        headers = {'Authorization': '{0} {1}'.format(self.JWT_PREFIX, token)}
        r = requests.post(self.POST_WEBSOCKET_LOG_URL, data=data, headers=headers)
        print(r.status_code, r.reason)
        return r.text


if __name__ == "__main__":
    hal_api = HalApi()
    token = hal_api.get_token()
    print('token: {0}'.format(token))

    data = {'from': 'marcin', 'to': 'server', 'event': 'init','data': {'message': 'dupa'}}
    response = hal_api.post_websocket_log(data)
    print('response: {0}'.format(response))
