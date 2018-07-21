# this runs on cron, see crontab.txt
wget https://murmuring-anchorage-8062.herokuapp.com/distances.json -O ~/spaceprob.es/d_temp.json; cp ~/spaceprob.es/d_temp.json ~/spaceprob.es/distances.json; rm ~/spaceprob.es/d_temp.json
