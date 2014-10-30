$(document).ready(function() {

  spaceprobes.init();

});

var spaceprobes = {

  dsn_data: {},
  probe_distances: {},

  init: function() {

    // fetch the dsn json feed
    url = "http://murmuring-anchorage-8062.herokuapp.com/dsn/spaceprobes.json";
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'jsonp',
      timeout: 3000,
      error:function (xhr, ajaxOptions, thrownError){
        $('#probes').slideDown("slow");
      },
      success: function(data) {
        spaceprobes.dsn_data = data.spaceprobes;

        // update distance display for each probe
        for (var dsn_name in spaceprobes.dsn_data) {
          dsn_name = $.trim(dsn_name);
          distance = Number(spaceprobes.dsn_data[dsn_name]['uplegRange']);
          if (distance > 0) {
              distance_str = numeral(distance).format('0.00 a');
              elem = 'span[class=' + dsn_name + ']';
              $(elem, '.distance').html(distance_str);
              spaceprobes.probe_distances[dsn_name] = distance;
          }
        }

        // rearrange the homepage probes to be in distance order
        if ($('#probes').is(":hidden")) {
            // this is the homepage, rearrange the probes and display them

            // sort the probes by distance
            dsn_probes_sorted = Object.keys(spaceprobes.probe_distances).sort(function(a,b){return spaceprobes.probe_distances[b]-spaceprobes.probe_distances[a]; });

            // grab each probe snippet from the homepage #probes div and then empty the div
            probe_snippets = {};
            my_list = [];
            count = 0;
            $('#probes').children().each(function() {
                count = count + 1;
                title = $(this).data('title');
                dsn = $(this).data('dsn');
                my_list.push(title);
                if (dsn.length) {
                    probe_snippets[dsn] = $(this);
                } else {
                    probe_snippets[title] = $(this);
                }
            });
            $('#probes').html('');


            // re-append all the snippets in order of distance
            for (var k in dsn_probes_sorted) {
                title = dsn_probes_sorted[k];
                if (title in probe_snippets) {
                    // append to #probes
                    $('#probes').append(probe_snippets[title]);
                    delete probe_snippets[title];
                }
            }

            // now append whatever is left = the un sorted ones with no distance info
            for (var p in probe_snippets) {
                $('#probes').append(probe_snippets[p]);
            }

            // and display it
            $('#probes').slideDown("slow");

        }
      } // success
    });

  }, // /get_dsn


}; // /var spaceprobes


// override numerals defaults to make nice words describing distances
numeral.language('en', {
    delimiters: {
        thousands: ',',
        decimal: '.'
    },
    abbreviations: {
        thousand: 'thousand',
        million: 'million',
        billion: 'billion',
        trillion: 'trillion'
    },

});

