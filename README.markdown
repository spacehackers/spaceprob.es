# [spaceprob.es](http://spaceprob.es)

We love space probes to the Moon and beyond! [Spaceprob.es](http://spaceprob.es)
catalogs the active human-made machines that freckle our solar system and dot our
galaxy. For each space probe, we've affectionately crafted a short-and-sweet
summary as well as handpicked geeky hyperlinks we think are worth exploring.
Where possible, we utilize data from the [Deep Space Network](https://eyes.nasa.gov/dsn/dsn.html).


[spaceprob.es](http://spaceprobe.es) website is built with this Jekyll repo and also 2 backend API apps for the dynamic content: 

For the latest news see: <https://github.com/spacehackers/topstories>

For the space probe distances to Earth see: <https://github.com/spacehackers/api.spaceprob.es>


## Installing

1. Clone the repo

        git clone https://github.com/<GITHUB_USERNAME>/spaceprob.es.git
        cd spaceprob.es


2. install jekyll and the i18n plugin

        # if these fail because of write permissions
        # add sudo to the front: "sudo gem install.."
        
        gem install jekyll -v 2.5.3
        gen install i18n


3. Serve locally

        jekyll _2.5.2_ serve --watch


        
