#!/usr/bin/env python
# -*- coding: utf-8 -*-
import urllib, json
from speech import Speech

class Weather():

    API_KEY = '01daaa0160eb1f77'
    LANG = 'US'
    COUNTRY = 'POLAND'
    CITY = 'WROCLAW'

    def __init__(self, country=COUNTRY, city=CITY, lang=LANG, api_key=API_KEY):
        self.API_KEY = api_key
        self.LANG = lang
        self.COUNTRY = country
        self.CITY = city

    def check_weather(self):
        url = 'http://api.wunderground.com/api/{0}/forecast/lang:{1}/q/{2}/{3}.json'.format(self.API_KEY, self.LANG, self.COUNTRY, self.CITY)
        try:
            response = urllib.urlopen(url)
            data = json.loads(response.read())
            return data
        except:
            data = "Weather: Cannot connect to weather api!"
            print data
        

if __name__ == '__main__':
    print "Init..."
    weather = Weather().check_weather()
    print weather