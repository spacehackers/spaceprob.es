$(document).ready(function() {

  spaceprobes.init();
  spaceprobes.init_news();

});

var spaceprobes = {

  probe_distances: {},

  init: function() {

    // fetch the distances json feed
    url = "http://murmuring-anchorage-8062.herokuapp.com/distances.json";
    // url = "http://127.0.0.1:5000/distances.json";  // local
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'jsonp',
      timeout: 4000,
      error:function (xhr, ajaxOptions, thrownError){

        $('#probes').slideDown("slow");

        if(textStatus==="timeout") {
              // todo
        }
      },
      success: function(data) {
        // first update distance display for each probe
        // this may be running on the probe page or the homepage
        for (var slug in data.spaceprobe_distances) {
          distance = Number(data.spaceprobe_distances[slug]);
          if (distance > 0) {
              distance_str = numeral(distance).format('0.00 a');
              elem = '.distance span[class=' + slug + ']';
              $(elem).html(distance_str);
              spaceprobes.probe_distances[slug] = distance;
          }
        }

        // sort the probes by distance
        api_probes_sorted = Object.keys(spaceprobes.probe_distances).sort(function(a,b){return parseInt(spaceprobes.probe_distances[b], 10)-parseInt(spaceprobes.probe_distances[a], 10); });


        // rearrange the homepage probes to be in distance order
        if ($('#probes').is(":hidden")) {
            // true if this is the homepage

            // grab each probe snippet from the homepage #probes div and then empty the div
            probe_snippets = {};
            my_list = [];
            count = 0;
            $('#probes').children().each(function() {
                count = count + 1;
                title = $(this).data('title');
                slug = $(this).data('slug');
                my_list.push(title);
                if (slug.length) {
                    probe_snippets[slug] = $(this);
                } else {
                    probe_snippets[title] = $(this);
                }
            });
            $('#probes').html('');


            // re-append all the snippets in order of distance
            for (var k in api_probes_sorted) {
                title = api_probes_sorted[k];
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

        } else { // end if homepage

            // this is a probe page, compute the next/prev links
            slug = $('#probe-detail').data("slug");
            key = api_probes_sorted.indexOf(slug);

            try {
                next = api_probes_sorted[key + 1];
                $('.pagination a.next').attr("href", '/' + next.replace(/-/g,''));
            } catch(e) {
                $('.pagination a.next').hide();
            }
            try {
                prev = api_probes_sorted[key - 1];
                $('.pagination a.prev').attr("href", '/' + prev.replace(/-/g,''));
            } catch(e) {
                $('.pagination a.prev').hide();
            }

        }

      } // success
    });

  }, // /get_dsn

  init_news: function() {
    // just ping the news site make sure it's awake for any probe pages
    $.ajax({ url: "http://dry-eyrie-9951.herokuapp.com/"});
  }

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

