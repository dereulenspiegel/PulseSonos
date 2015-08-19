"use strict";
var portastic = require("portastic");
var ip = require("ip");
var Nicercast = require("nicercast");

var streams = [];

module.exports = {
  createStream: function(name, input, cb){
    portastic.find({min:8000, max:10000, retrieve: 1}, function(err, port){
      if (err) {
        throw err;
      }
      var server = new Nicercast(input, { name: name });
      var stream = {
        server: server,
        port: port,
        name: name,
        streamUrl: "http://" + ip.address() + "/listen.m3u"
      };
      input.on("error", function(){
        server.stop();
      });
      input.on("state", function(state){
        if(state === "terminated"){
          server.stop();
        }
      });
      server.start(port);
      streams.push(stream);
      if (cb){
        cb(stream);
      }
    });
  },

  destroyStream: function(name){
    for(var x in streams){
      if(name === streams[x].name){
        streams.splice(x, 1);
        return;
      }
    }
  }
};