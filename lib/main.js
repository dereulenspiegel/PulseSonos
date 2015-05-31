"use strict";
var portastic = require('portastic');
var ip = require('ip');
var PulseAudio = require('pulseaudio');
var Nicercast = require('nicercast');
var flags = require('flags');
var sonosService = require('./sonos-service.js');

flags.defineBoolean('diagnostics', false, 'run diagnostics utility');
flags.defineBoolean('version', false, 'return version number');
flags.defineString('server', 'localhost' , 'Set the PulseAudio server');
flags.defineString('pulse-flag','noflags','Flags for PulseAudio client');
flags.defineBoolean('register',false,'Register as a Sonos Music Service');
flags.defineBoolean('unregister',false,'Unregister this Sonos Music Service');
flags.parse();


if (flags.get('version')) {
  var pjson = require('../package.json');
  console.log(pjson.version);

} else if (flags.get('diagnostics')) {
  var diag = require('./diagnostics');
  diag();

} else if(flags.get('register')) {
  var sonosRegister = require('./sonos-register.js');
  sonosRegister.register();

} else if(flags.get('unregister')) {
  var sonosRegister = require('./sonos-register.js');
  sonosRegister.unregister();

} else {

  var icecastServer,
      pulseAudioServer = flags.get('server');
      console.log("Trying to connect to PulseAudio server " + pulseAudioServer);

  var pulseContext = new PulseAudio({
        client: "PulseSonos",
        server: pulseAudioServer,
        flags: flags.get('pulse-flag')
      });

  pulseContext.on('error',function(){
    console.log("Received error in PulseAudio context ");
    if(icecastServer){
      icecastServer.stop();
    }
  });

  pulseContext.on('state', function(state){
    console.log('PulseAudio Context state: ' + state);
  });

  pulseContext.on('connection', function(){
    console.log('Creating playback stream');

    var playbackStream = pulseContext.record();

    playbackStream.on('state', function(state){
      console.log('PlaybackStream state: ' + state);
    });

    playbackStream.on('error', function(){
      console.log('Error in playback stream, shutting down');
      playbackStream.end();
      pulseContext.end();
      if(icecastServer) {
        icecastServer.stop();
      }
    });

    playbackStream.on('connection', function(){
      console.log('PlaybackStream connected');
      portastic.find({
            min: 9000,
            max: 9001,
            retrieve: 1
          }, function(err,port){
            if (err) throw err;
            console.log('Creating Icecast server');
            icecastServer = new Nicercast(playbackStream,{
              name : 'PulseSonos'
            });
            var streamUrl = 'http://' + ip.address() + ':' + port + '/listen.m3u';

            console.log('Stream is reachable via ' + streamUrl);

            playbackStream.on('state', function(state){
              if(state === 'terminated'){
                console.log('PulseAudio Playback stream terminated');
                icecastServer.stop();
              }
            });

            icecastServer.start(port);
            sonosService.start(streamUrl);
          });
    });
  });
}
