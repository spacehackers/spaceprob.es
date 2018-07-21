# this runs on cron every 10 minutes 
wget https://dry-eyrie-9951.herokuapp.com/news.json -O ~/spaceprob.es/temp.json; cp ~/spaceprob.es/temp.json ~/spaceprob.es/news.json; rm ~/spaceprob.es/temp.json
wget https://murmuring-anchorage-8062.herokuapp.com/distances.json -O ~/spaceprob.es/d_temp.json; cp ~/spaceprob.es/d_temp.json ~/spaceprob.es/distances.json; rm ~/spaceprob.es/d_temp.json
