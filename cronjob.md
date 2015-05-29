this is the cronjob that needs to run twice a day to bring the news.json feed to local server
because Heroku only wakes up twice a day
wget was having fussy problem updating same filename so that is why the temp.json stuff.. 

	0	12	*	*	*	wget http://dry-eyrie-9951.herokuapp.com/news.json -O ~/spaceprob.es/temp.json; cp ~/spaceprob.es/temp.json ~/spaceprob.es/news.json; rm ~/spaceprob.es/temp.json
