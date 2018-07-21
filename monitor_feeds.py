import requests
import pprint
from datetime import datetime

all_urls = ['http://spaceprob.es/distances.json',
        'http://spaceprob.es/news.json',
        'http://dry-eyrie-9951.herokuapp.com/news.json',
        'http://murmuring-anchorage-8062.herokuapp.com/distances.json'
        ]

all_last_modified = {}
fail = False
for url in all_urls:
    response = requests.head(url)

    try:
        last_modified = response.headers['Last-Modified']  # apache
    except KeyError:
        last_modified = response.headers['Date']  # heroku/gunicorn

    # Sat, 21 Jul 2018 01:39:42 GMT
    gmt_time = datetime.strptime(last_modified, '%a, %d %b %Y %H:%M:%S GMT')
    all_last_modified[url] = last_modified

    if ((datetime.utcnow() - gmt_time).days) > 3:
        fail = True

pp = pprint.PrettyPrinter()
if fail:
    print("\n Your feeds at spaceprob.es have not been updating! \n")
else:
    print("\n the feeds are alright: \n")

pp.pprint(all_last_modified)
