$(document).ready(function() {

  spaceprobes.init();
  spaceprobes.init_news();

});

var spaceprobes = {

    distances_feed_url: "http://murmuring-anchorage-8062.herokuapp.com/distances.json",
    // distances_feed_url: "http://127.0.0.1:5000/distances.json", // local

    distances: {},
    sorted: [],
    sort_by: 'distance',  // 'distance' or 'launch'


    init_news: function() {
        // just ping the news site make sure it's awake for any probe pages
        $.ajax({ url: "http://dry-eyrie-9951.herokuapp.com/"});
    },

    init: function() {

        $.ajax({
            url: spaceprobes.distances_feed_url,
            type: 'get',
            dataType: 'jsonp',
            timeout: 4000,
            error:function (xhr, ajaxOptions, thrownError){
                // just show the #probes div as it was drawn by Jekyll
                $('#probes').slideDown("slow");
                if(textStatus==="timeout") {
                      // todo
                }
            },
            success: function(data) {

                // the distances arrive as text, make them numbers in
                // this data struct, and also display them in their
                // html place holders and properly formatted
                for (var slug in data.spaceprobe_distances) {
                    distance = Number(data.spaceprobe_distances[slug]);
                    if (distance > 0) {
                        distance_str = numeral(distance).format('0.00 a');
                        elem = '.distance span[class=' + slug + ']';
                        $(elem).html(distance_str);
                        spaceprobes.distances[slug] = distance;
                    }
                }

                // make a list of probes slugs ordered by distance
                sorted_by_time = Object.keys(spaceprobes.distances).sort(function(a,b){return parseInt(spaceprobes.distances[b], 10)-parseInt(spaceprobes.distances[a], 10); });

                spaceprobes.sorted = sorted_by_time;

                // rearrange the homepage probes and store the sorting by launch date
                if ($('#probes').is(":hidden")) {
                    // true if this is the homepage

                    // grab each probe snippet and info from the homepage Jekyll drew it
                    // this will be in launch date order
                    probe_snippets = {};
                    sorted_by_launch = [];
                    count = 0;
                    $('#probes').children().each(function() {
                        count = count + 1;
                        title = $(this).data('title');
                        slug = $(this).data('slug');
                        sorted_by_launch.push(slug);
                        if (slug.length) {
                            probe_snippets[slug] = $(this);
                        } else {
                            probe_snippets[title] = $(this);
                        }
                    });

                    // re-append all the snippets in sorted order

                    // first hide the #probes div
                    $('#probes').html('');

                    // append each widget that appears in spaceprobes.sorted
                    for (var k in spaceprobes.sorted) {
                        title = spaceprobes.sorted[k];
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

                    // and display the #probes div
                    $('#probes').slideDown("slow");


                } else { // end if homepage
                    // this is a probe page, display the  the next/prev links
                    spaceprobes.display_paging_links();
                }

            } // success
        });

    }, // /init

    display_paging_links: function() {
        // for the probe detail page, computes the
        // next/prev link href and displays the next/prev link

        slug = $('#probe-detail').data("slug");
        key = spaceprobes.sorted.indexOf(slug);

        try {
            next = spaceprobes.sorted[key + 1];
            $('.pagination a.next').attr("href", '/' + next.replace(/-/g,''));
        } catch(e) {
            $('.pagination a.next').hide();
        }
        try {
            prev = spaceprobes.sorted[key - 1];
            $('.pagination a.prev').attr("href", '/' + prev.replace(/-/g,''));
        } catch(e) {
            $('.pagination a.prev').hide();
        }
    }



}; // /var spaceprobes


// overriding Numerals plugin defaults to make nice words describing distances
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

