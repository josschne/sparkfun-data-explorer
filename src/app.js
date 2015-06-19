
// Import the UI elements
var UI = require('ui');
var ajax = require('ajax');

var SOURCES_URL = "https://data.sparkfun.com/streams.json";
var STREAM_URL_BASE = "https://data.sparkfun.com/output/";

//Download data from Sparkfun
ajax({url: SOURCES_URL, type: 'json'},
  function(json) {
    var availableStreams = [];
    json.streams.forEach(function(stream) {
      availableStreams.push( {title: stream.title, key: stream.publicKey} );
    });
    var sources = new UI.Menu({
      sections: [{
        title: 'Public Data Sources',
        items: availableStreams
      }]
    });
    sources.show();
    sources.on('select', function(e) { console.log('Selected stream ' + e.item); showStream(e.item); });
  }, function(err) {
    console.log('Error showing streams: ' + err);
  }
);

function showStream(stream) {
  var streamURL = STREAM_URL_BASE + stream.key + '.json?page=1';
  console.log('Fetching: ' + streamURL);
  ajax({url: streamURL, type: 'json'},
    function(json) {
      var details = "";
      var lastestReadings = json[0];
      for (var prop in lastestReadings) {
        details += prop + ": " + lastestReadings[prop] + "\n";
      }
      var streamDetail = new UI.Card({
        title: stream.title,
        body: details,
        scrollable: true
      });
      streamDetail.show();
  }, function(err) {
    console.log('Error showing details: '+ JSON.stringify(err));
  });
}