"use strict";
var pulse = require("./pulseaudio.js");
var flags = require("flags");
var sonosService = require("Sonos-Node-API");
var icecast = require("./icecast.js");

flags.defineBoolean("diagnostics", false, "run diagnostics utility");
flags.defineBoolean("version", false, "return version number");
flags.defineString("server", "localhost" , "Set the PulseAudio server");
flags.defineString("pulse-flag","noflags","Flags for PulseAudio client");
flags.defineBoolean("register",false,"Register as a Sonos Music Service");
flags.defineBoolean("unregister",false,"Unregister this Sonos Music Service");
flags.parse();

var context = pulse.connect();

context.on("connection", function(){
  context.source(function(list){
    for(var x in list){
      console.log("Source: %j",list[x]);
      var source = list[x];
      if(source.driver !== "module-null-sink.c" ){
        console.log("Creating record stream for source "+source.name);
        var stream = context.createRecordStream({
          stream: "Recording "+source.name,
          device: "Device for " + source.name,
          format: source.format,
          rate: source.rate ,
          channels: source.channels
        });
        stream.on("connection", function(){
          icecast.createStream(source.name, stream);
        });
      }
    }
  });
});