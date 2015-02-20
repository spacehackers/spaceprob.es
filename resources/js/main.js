$(document).ready(function() {

    spaceprobes.init();
    spaceprobes.init_news();

    $('#content').on("click", 'a.distance, a.launch', function(e) {

        $('.sorting a').removeClass('sortby_selected');
        $(this).addClass('sortby_selected').blur();

        if ($(this).hasClass('launch')) {
            spaceprobes.current_sort = 'launch';
            spaceprobes.display_probes(spaceprobes.slugs_sorted_by_launch);
        } else {
            spaceprobes.current_sort = 'distance';
            spaceprobes.display_probes(spaceprobes.slugs_sorted_by_distance);
        }
        e.preventDefault();
    });

});

var spaceprobes = {

    distances_feed_url: "http://murmuring-anchorage-8062.herokuapp.com/distances.json",
    // distances_feed_url: "http://127.0.0.1:5000/distances.json", // local

    slugs_sorted_by_distance:[],
    slugs_sorted_by_launch:[],
    probe_snippets: {},
    current_sort: 'distance',  // 'distance' or 'launch'


    init_news: function() {
        // just ping the news site make sure it's awake for any probe pages
        $.ajax({ url: "http://dry-eyrie-9951.herokuapp.com/cassini",
                dataType: 'jsonp'
        });
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

                distances = {}
                // the distances arrive as text, make them numbers in
                // this data struct, and also display them in their
                // html place holders and properly formatted
                for (var slug in data.spaceprobe_distances) {
                    distance = Number(data.spaceprobe_distances[slug]);
                    if (distance > 0) {
                        distance_str = numeral(distance).format('0.00 a');
                        elem = '.distance span[class=' + slug + ']';
                        $(elem).html(distance_str);
                        distances[slug] = distance;
                    }
                }

                // make a list of probes slugs ordered by distance
                spaceprobes.slugs_sorted_by_distance = Object.keys(distances).sort(function(a,b){return parseInt(distances[b], 10)-parseInt(distances[a], 10); });

                // rearrange the homepage probes and store the sorting by launch date
                if (!$('#probe-detail').length) {
                    // true if this is the homepage

                    // grab each probe snippet and info from the homepage Jekyll drew it
                    // this will be in launch date order

                    count = 0;
                    $('#probes').children().each(function() {
                        count = count + 1;
                        title = $(this).data('title');
                        slug = $(this).data('slug');
                        spaceprobes.slugs_sorted_by_launch.push(slug);
                        spaceprobes.probe_snippets[slug] = $(this);
                    });

                    // no we have 2 lists of sorted slugs
                    // and a dict containing the html for each slug

                    spaceprobes.display_probes(spaceprobes.slugs_sorted_by_distance);


                } else { // end if homepage
                    // this is a probe page, display the  the next/prev links
                    spaceprobes.display_paging_links();
                }

            } // success
        });

    }, // /init

    display_probes: function(slug_list) {

        $('#probes').hide();

        // make a local clone of the spaceprobes.probe_snippets array
        var probe_snippets = $.extend(true,{},spaceprobes.probe_snippets);

        // append the snippets to the div in slug_list order
        for (var k in slug_list) {
            slug = slug_list[k];
            $('#probes').append(probe_snippets[slug]);
            delete probe_snippets[slug];
        }

        // are there any left over? append those at bottom of page
        // (this happens like when a probe has no distance data yet)
        for (var slug in probe_snippets) {
            $('#probes').append(probe_snippets[slug]);
        }

        // $('#probes').fadeIn("fast");
        $('#probes').show();

    },

    display_paging_links: function() {
        /*
        // for the probe detail page, computes the
        // next/prev link href and displays the next/prev link

        slug = $('#probe-detail').data("slug");
        key = spaceprobes.sorted.indexOf(slug);

        var slugs_sorted;
        if (spaceprobes.current_sort == 'launch') {
            slugs_sorted = spaceprobes.slugs_sorted_by_launch;
        } else {
            slugs_sorted = spaceprobes.slugs_sorted_by_distance;
        }

        key = slugs_sorted.indexOf(slug);

        try {
            next = slugs_sorted[key + 1];
            $('.pagination a.next').attr("href", '/' + next.replace(/-/g,''));
        } catch(e) {
            $('.pagination a.next').hide();
        }
        try {
            prev = slugs_sorted[key - 1];
            $('.pagination a.prev').attr("href", '/' + prev.replace(/-/g,''));
        } catch(e) {
            $('.pagination a.prev').hide();
        }
        */
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

