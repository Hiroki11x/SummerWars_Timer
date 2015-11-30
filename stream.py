# -*- coding: utf-8 -*-
 
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json
 
consumer_key = "9qWcQ9k80DxecS9GyhykRgf3z"#引用符の中にconsumer_keyの情報を記述する
consumer_secret = "fMjcRFTv0EvcI9F927eodMwV9TC9ZRxl4MB3Q54E5tQrzFIYeL"#引用符の中にconsumer_secretの情報を記述する
 
access_token = "2723779602-Z2JRov3x8JplTTGBDFPJpuktHsunt3MfkI3Otmc"#引用符の中にaccess_tokenの情報を記述する
access_token_secret = "R50PrgRXF7GipvtBqZ5s13o1DEG2bsfsdgj4cwQf3TfI4"#引用符の中にaccess_token_secretの情報を記述する
 
class StdOutListener(StreamListener):
    def on_data(self, data):
        if data.startswith("{"):
            print data
            f = open('stream.json', 'w')
            f.write(data)
            f.close()
        return True
 
    def on_error(self, status):
        print status
 
if __name__ == '__main__':
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)
    stream.filter(track = ['pampers'])#検索する場合