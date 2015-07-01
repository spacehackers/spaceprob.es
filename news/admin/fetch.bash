# the news API lives on a different domain, we fetch it daily with this bash script via cron
wget https://dry-eyrie-9951.herokuapp.com/news.json -O ~/spaceprob.es/temp.json; cp ~/spaceprob.es/temp.json ~/spaceprob.es/news.json; rm ~/spaceprob.es/temp.json

