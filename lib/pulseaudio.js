"use strict";
var PulseAudio = require("pulseaudio");

var pulseContext = null;

function onStateChange(state) {
  console.log("New state %j", state);
};

function onError(error) {
 console.log("Error from Pulseaudio: %j", error);
};

function generateStreamName() {
  // TODO generate random string
  return "blah";
}

function generateDeviceName() {
  // TODO generate random device name
  return "random device";
}

module.exports = {
  connect: function() {
    pulseContext = new PulseAudio({
      client: "PulseSonos",
      server: "localhost",
      flags: "noflags"
      // "noflags|noautospawn|nofail"
    });
    pulseContext.on("error",onError);
    pulseContext.on("state",onStateChange);
    return pulseContext;
  },

  getSources: function(cb){
    if(! pulseContext ){
      module.exports.connect();
      pulseContext.on("connection", function(){
        pulseContext.source(cb);
      });
    } else {
      pulseContext.source(cb);
    }
  },

  createRecordStream: function(streamConfig) {
    var config = streamConfig || {
      stream: generateStreamName(),
      device: generateDeviceName(),
      format: "S16LE",
      rate: 44100,
      channels: 2
    };
    var record = pulseContext.record(config);
    return record;
  }
};