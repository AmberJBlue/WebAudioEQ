var ctx = window.AudioContext || window.webkitAudioContext;
var context = new ctx();
var url = "https://ia600305.us.archive.org/30/items/return_201605/return.mp3";

var filters = [];

fetch(url)
  .then(response => response.blob())
  .then(blob => {
    var blobURL = URL.createObjectURL(blob);
    var mediaElement = document.getElementById('player');
    mediaElement.src = blobURL;
    var sourceNode = context.createMediaElementSource(mediaElement);

    // create the equalizer. It's a set of biquad Filters
    // Set filters
    [60, 170, 350, 1000, 3500, 10000].forEach(function(freq, i) {
      var eq = context.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      filters.push(eq);
    });

    // Connect filters in serie
    sourceNode.connect(filters[0]);
    for (var i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }

    // connect the last filter to the speakers
    filters[filters.length - 1].connect(context.destination);

  });

function changeGain(sliderVal, nbFilter) {
  var value = parseFloat(sliderVal);
  filters[nbFilter].gain.value = value;



  // // update output labels
  // var output = document.querySelector("#gain" + nbFilter);
  // output.value = value + " dB";
}
