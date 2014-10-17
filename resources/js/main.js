$(document).ready(function() {
  spaceprobes.get_dsn();

});

var spaceprobes = {

  dsn_data: {},

  get_dsn: function() {

    url = "http://murmuring-anchorage-8062.herokuapp.com/dsn/probes.json";

    $.ajax({
      url: url,
      type: 'get',
      dataType: 'jsonp',
      success: function(data) {
        spaceprobes.dsn_data = data.dsn_by_probe;
        // alert(JSON.stringify(spaceprobes.dsn_data.MVN));

        for (var dsn_name in spaceprobes.dsn_data) {
//          console.log(typeOf(dsn_name);
          // wtf?
          // elem = "div\\.distance\\." + dsn_name;
          elem = 'span[class=' + dsn_name + ']';
          distance = Number(spaceprobes.dsn_data[dsn_name]['uplegRange']);
          distance_words = numeral(distance).format('0.00 a');
          $(elem, '.distance').html(distance_words);
        }
      }
    });

  }, // /loaddata


}; // /var spaceprobes

// override numerals defaults to make nice words
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

