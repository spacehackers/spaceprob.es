$(document).ready(function() {
  spaceprobes.init();

  // main menu highlighting what page we are on
  $("ul.nav li a").css("color", "#B8B8B8");
  if ($(".aboutpage").is(":visible")) {
    $("ul.nav li a.about").css("color", "white");
  }
  if ($(".shop").is(":visible")) {
    $(".nav a.shop").css("color", "white");
  }

  // the sorting buttons behavior
  $("#content").on("click", "a.distance, a.launch", function(e) {
    $(".sorting a").removeClass("sortby_selected");
    $(this)
      .addClass("sortby_selected")
      .blur();

    if ($(this).hasClass("launch")) {
      spaceprobes.current_sort = "launch";
      spaceprobes.display_probes(spaceprobes.slugs_sorted_by_launch);
    } else {
      spaceprobes.current_sort = "distance";
      spaceprobes.display_probes(spaceprobes.slugs_sorted_by_distance);
    }
    e.preventDefault();
  });

  // The following allows relative links within spaceprob.es to remain within the Apple web
  // app on iOS. Non-relative links open in Safari.
  if (window.navigator.standalone) {
    // The app is running in standalone mode.
    var a = document.getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
      var pat = /^https?:\/\//i;
      var href = a[i].getAttribute("href");
      if (!pat.test(href) && href !== "") {
        a[i].onclick = function() {
          window.location = this.getAttribute("href");
          return false;
        };
      }
    }
  }

  // overriding Numerals plugin defaults to make nice words describing distances
  numeral.language(
    "en",
    {
      delimiters: {
        thousands: ",",
        decimal: "."
      },
      abbreviations: {
        thousand: "thousand",
        million: "million",
        billion: "billion",
        trillion: "trillion"
      }
    },

    "tr",
    {
      delimiters: {
        thousands: ",",
        decimal: "."
      },
      abbreviations: {
        thousand: "bin",
        million: "milyon",
        billion: "milyar",
        trillion: "trilyon"
      }
    }
  );
  lang = $("html").attr("lang");
  numeral.language(lang);
});

var spaceprobes = {
  // how to test distances locally is explained in https://github.com/spacehackers/api.spaceprob.es/blob/master/api.py

  distances_feed_url: "/distances.json",
  // distances_feed_url: "http://127.0.0.1:5000/distances.json", // local

  slugs_sorted_by_distance: [],
  slugs_sorted_by_launch: [],
  probe_snippets: {},
  current_sort: "distance", // 'distance' or 'launch'
  all_probes_meta: {},
  distances: {},

  init: function() {
    $.ajax({
      url: spaceprobes.distances_feed_url,
      type: "get",
      dataType: "json",
      cache: false,
      success: function(data) {
        // the distances arrive as text, make them numbers in
        // this data struct, and also display them in their
        // html place holders and properly formatted
        for (var slug in data.spaceprobe_distances) {
          var distance = Number(data.spaceprobe_distances[slug]);
          if (distance > 0) {
            spaceprobes.distances[slug] = distance;
          }
        }

        // make a list of probes slugs ordered by distance, then alphabetically
        spaceprobes.slugs_sorted_by_distance = spaceprobes.order_by_distance(
          spaceprobes.distances
        );

        // rearrange the homepage probes and store the sorting by launch date
        if (!$("#probe-detail").length) {
          // this is the homepage!

          // grab each probe snippet and info from the homepage Jekyll drew it
          // this will be in launch date order

          $.ajax({
            url: "/probelist.html",
            type: "get",
            dataType: "html",
            success: function(probelist) {
              count = 0;
              $(probelist)
                .filter("#probelist")
                .children()
                .each(function() {
                  count = count + 1;
                  title = $(this).data("title");
                  slug = $(this).data("slug");
                  spaceprobes.slugs_sorted_by_launch.push(slug);
                  spaceprobes.probe_snippets[slug] = $(this);
                });

              // no we have 2 lists of sorted slugs
              // and a dict containing the html for each slug
              spaceprobes.display_probes(spaceprobes.slugs_sorted_by_distance);
            }
          });
        }
      } // success
    });
  }, // /init

  display_probes: function(slug_list) {
    // make a local clone of the spaceprobes.probe_snippets array
    var probe_snippets = $.extend(true, {}, spaceprobes.probe_snippets);

    var probes_container = $('<div id="probes" class="row"></div>');
    $(".frontpage").append(probes_container);

    // append the snippets to the div in slug_list order, add the distances
    for (var k in slug_list) {
      slug = slug_list[k];

      // update the distance
      var distance = Number(spaceprobes.distances[slug]);
      if (distance > 0) {
        var distance_str = numeral(distance).format("0.00 a");
        $(probe_snippets[slug])
          .find(".distance span[class=" + slug + "]")
          .html(distance_str);
      }

      $(probes_container).append(probe_snippets[slug]);

      delete probe_snippets[slug]; // see below, some probes have no distance
    } // slug_list

    // are there any left over? append those at bottom of page
    // (this happens like when a probe has no distance data yet)
    for (var slug in probe_snippets) {
      $(probes_container).append(probe_snippets[slug]);
    }
  },

  order_by_distance: function(distances) {
    /*
            order spaceprobes by distance
            for probes that are of equal distance, sort them alphabetically
        */

    // Note: Why is this so long? was originally 2 lines of code:
    // var sorted_keys = Object.keys(data.spaceprobe_distances).sort();  // first sort by alpha
    // spaceprobes.slugs_sorted_by_distance = sorted_keys.sort(function(a,b){return parseInt(distances[b], 10)-parseInt(distances[a], 10); });
    // which works in FF, Safari but not Chrome (others?):
    // because of the unpredictable way Chrome traverses the array in the sort function

    // sort the probes into distance groups, keys are distances values are lists of slugs
    // so that probes with the same distance end up in the same groupings
    var distance_groups = {};
    for (slug in distances) {
      distance = distances[slug];
      if (distance in distance_groups) {
        distance_groups[distance].push(slug);
      } else {
        distance_groups[distance] = [slug];
      }
    }
    // sort the distance groups by descending distance
    var agg_distances_sorted = Object.keys(distance_groups).sort(function(
      a,
      b
    ) {
      return b - a;
    });

    // sort the slugs alphabetically within each group, you'll get an array of arrays
    var slugs_arrays = [];
    for (d in agg_distances_sorted) {
      distance = agg_distances_sorted[d];
      distance_groups[distance].sort();
      slugs_arrays.push(distance_groups[distance]);
    }

    // now flatten the array of arrays and return that
    merged = [];
    merged = merged.concat.apply(merged, slugs_arrays);
    return merged;
  }
}; // /var spaceprobes
