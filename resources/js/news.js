
// chnage template brackets to prevent jekyll interpolation
var spaceapp = angular.module("spaceapp", ['ngResource']).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
});


spaceapp.factory('news', function($resource){

    return {
        fetchNews: function(callback){

            url = "/news.json";

            var api = $resource(url,{},{fetch:{method:'GET'}
            });

            api.fetch(function(data){
                // Call the supplied callback function
                callback(data);
            });
        }
    }
});

function NewsController($scope, news){

    // Default layout of the app. Clicking the buttons in the toolbar
    // changes this value.

    $scope.probes_by_date = [];

    // Use the instagram service and fetch a list of the popular pics
    news.fetchNews(function(data){

        // this is so klugey why isn't this python 
        // make a list of just the published times sorted
        var just_times = [];
        for (probe in data) {

            if (!data[probe]['title']) {
                continue;
            }

            // while we are looping here, stop and 
            // trim the length of the news headline if too long :-( 
            title_max_length = 77;
            if (data[probe]['title'].length > title_max_length) {
                new_title = '';
                words = data[probe]['title'].split(' ');
                for (i in words) {
                    new_title += ' ' + words[i];
                    if (new_title.length > title_max_length-4) {
                        new_title += '...';
                        break;
                    }
                }
                data[probe]['title'] = new_title;
            }

            just_times.push(data[probe]['published']);
        }
        just_times.sort().reverse();

        // with that make a list of the probe names sorted by time
        var probes_by_time = [];  /* create a new object to hold the sorted list */
        for (k in just_times) {  /* loop through all the times */
            time = just_times[k];
            if (!time) { continue; }
            for (probe in data) {  /* find the probe with this time */
                if (!probe) { continue; }
                if (data[probe]['published'] == time & probes_by_time.indexOf(probe) < 0) {

                    probes_by_time.push(probe);

                }
            }
        }

        $scope.all_news = data;
        $scope.probes_by_time = probes_by_time;
        $scope.probes_meta = spaceprobes.all_probes_meta;

    });

}
