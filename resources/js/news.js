
// chnage template brackets to prevent jekyll interpolation
var spaceapp = angular.module("spaceapp", ['ngResource']).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
});


spaceapp.factory('news', function($resource){

    return {
        fetchNews: function(callback){

            url = "http://dry-eyrie-9951.herokuapp.com";

            var api = $resource(url + '?callback=JSON_CALLBACK',{},{
                fetch:{method:'JSONP'}
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
            if (probe) {
                just_times.push(data[probe]['published']);
            }
        }
        just_times.sort().reverse();

        // with that make a list of the probe names sorted by time
        var probes_by_time = [];
        for (k in just_times) {
            time = just_times[k];
            if (!time) { continue; }
            for (probe in data) {
                if (!probe) { continue; }
                if (data[probe]['published'] == time) {
                    probes_by_time.push(probe);
                }
            }
        }

        $scope.all_news = data;
        $scope.probes_by_time = probes_by_time;
        $scope.probe_images = spaceprobes.all_probe_images;

    });

}
