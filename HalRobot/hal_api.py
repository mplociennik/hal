import requests
import multiprocessing
import json


class HalApi(multiprocessing.Process):
    API_ADDRESS = 'http://5.104.255.112:8000'
    GET_TOKEN_URL = '{0}/login_check'.format(API_ADDRESS)
    POST_WEBSOCKET_LOG_URL = '{0}/api/websocket-log'.format(API_ADDRESS)
    API_LOGIN = 'halapi'
    API_PASSWORD = ''
    JWT_PREFIX = 'JWT'

    def get_token(self):
        payload = {'_username': self.API_LOGIN, '_password': self.API_PASSWORD}
        r = requests.post(self.GET_TOKEN_URL, data=payload)
        print(r.status_code, r.reason)
        token = None
        if r.status_code == 200:
            responseObj = json.loads(r.text)
            token = responseObj['token']
        return token

    def post_websocket_log(self, data):
        print('data: {0}'.format(data))
        token = self.get_token()
        print('token: {0}'.format(token))
        if token is not None:
            headers = {'Authorization': '{0} {1}'.format(self.JWT_PREFIX, token)}
            requestData = {
                'from': data['from'],
                'to': data['to'],
                'event': data['event'],
                'data': json.dumps(data['data'])
            }
            r = requests.post(self.POST_WEBSOCKET_LOG_URL, data=requestData, headers=headers)
            print(r.status_code, r.reason)
            return r.text
        else:
            return None


if __name__ == "__main__":
    hal_api = HalApi()
    token = hal_api.get_token()
    print('token: {0}'.format(token))
