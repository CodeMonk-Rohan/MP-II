# -*- coding: utf-8 -*-

from config import api_data

import base64
import hashlib
import hmac
import os
import sys
import time

import requests

'''
Replace "###...###" below with your project's host, access_key and access_secret.
'''

HOST = api_data['HOST']
ACCESS_KEY = api_data['ACCESS_KEY']
ACCESS_SECRET = api_data['ACCESS_SECRET']

access_key = ACCESS_KEY
access_secret = ACCESS_SECRET
requrl = f"{HOST}/v1/identify"

http_method = "POST"
http_uri = "/v1/identify"
# default is "fingerprint", it's for recognizing fingerprint,
# if you want to identify audio, please change data_type="audio"
data_type = "audio"
signature_version = "1"
timestamp = time.time()

string_to_sign = http_method + "\n" + http_uri + "\n" + access_key + "\n" + data_type + "\n" + signature_version + "\n" + str(
    timestamp)

sign = base64.b64encode(hmac.new(access_secret.encode('ascii'), string_to_sign.encode('ascii'),
                                 digestmod=hashlib.sha1).digest()).decode('ascii')

# suported file formats: mp3,wav,wma,amr,ogg, ape,acc,spx,m4a,mp4,FLAC, etc
# File size: < 1M , You'de better cut large file to small file, within 15 seconds data size is better
f = open(sys.argv[1], "rb")
sample_bytes = os.path.getsize(sys.argv[1])

files = [
    ('sample', ('test.mp3', open(sys.argv[1], 'rb'), 'audio/wav'))
]
data = {'access_key': access_key,
        'sample_bytes': sample_bytes,
        'timestamp': str(timestamp),
        'signature': sign,
        'data_type': data_type,
        "signature_version": signature_version}

r = requests.post(requrl, files=files, data=data)
r.encoding = "utf-8"
print(r.text.encode(encoding="utf-8"))