var soap = require('soap');
var fs = require('fs');
var http = require('http');

var sonosService = {
	Sonos: {
		SonosSoap: {

			getPulseAudioMetadata: function(arguments){
				return 
					[
						{
							id: "a-unique-id",
							mimeType: "audio/mp3",
							itemType: "stream",
							streamMetadata: {
								logo: "TODO show a nice Logo URL",
								currentShow: "PulseAudio"
							}
						}
					];
				
			},

			getSessionId: function(arguments) {
				console.log('SMAPI: getSessionId %j',arguments);
				return {
					getSessionIdResult: "a-unique-id"
				}
			},

			getMetadata: function(arguments) {
				console.log('SMAPI: getMetadata %j', arguments);
				return {
					getMetadataResult: {
						index: 0,
						count: 1,
						total: 1,
						mediaMetadata: [
							{
								id: "a-unique-id",
								mimeType: "audio/mp3",
								itemType: "stream",
								title: "PulseSonos",
								streamMetadata: {
									logo: "TODO show a nice Logo URL",
									currentShow: "PulseAudio",
									currentShowId: "pulse-sonos",
									secondsRemaining: -1, 	// FIXME, what about infinite streams, is -1 correct
									secondsToNextShow: -1,	// Same problem as above
									hasOutOfBandMetadata: false,
									description: "PulseSonos live stream from some system",
									isEphemeral: true
								}
							}
						]
					}
				};
			},

			getExtendedMetadata: function(arguments) {
				console.log('SMAPI: getExtendedMetadata %j', arguments);
				return {
					getExtendedMetadataResult: {
						mediaCollection: {
							id: "a-unique-id",
							itemType: "program",
							title: "PulseSonos",
							canScroll: false,
							canPlay: true,
							canEnumerate: false,
							canAddToFavorites: true,
							albumArtURI: "http://TODO"
						}
					}
				}
			},

			getExtendedMetadataText: function(arguments) {
				console.log('SMAPI: getExtendedMetadataText %j', arguments);
				return {
					getExtendedMetadataTextResult: "PulseSonos Audio Stream"
					
				}
			},

			getStreamingMetadata: function(arguments) {
				console.log('SMAPI: getStreamingMetadata %j', arguments);
				return {
					getStreamingMetadataResult: {
						segmentMetadata: [
							{
								id: "a-unique-id",
								trackId: "a-unique-id",
								track: "PulseSonos",
								artistId: "1",
								artist: "PulseSonos Server",
								showId: "a-unique-id",
								show: "PulseSonos Audio Stream",
								episodeId: "a-unique-id",
								episode: "PulseSonos Audio Stream",
								albumArtURI: "TODO We need an asset URI",
								startTime: "TODO Insert server start time",
								duration:0
							}
						]
					}
				}
			},

			getMediaURI: function(arguments) {
				console.log('SMAPI: getMediaURI %j', arguments);
				return {
					getMediaURIResult: "TODO M3u URI"
				}
			},

			search: function(arguments) {
				// We don't support search
				console.log('SMAPI: search %j', arguments);
				return {

				}
			},

			getMediaMetadata: function(arguments){
				console.log('SMAPI: getMediaMetadata %j', arguments);
				return {
					getMediaMetadataResult: {
						id: "a-unique-id",
						itemType: "stream",
						title: "PulseSonos",
						mimeType: "audio/mp3",
						trackMetadata: {
							duration: 0,
							canPlay: true,
							canSkip: false,
							canAddToFavorites: true
						}
					}
				}
			},

			getLastUpdate: function(arguments){
				console.log('SMAPI: getLastUpdate %j', arguments);
				return {
					getLastUpdateResult: "1"
				}
			}

		}
	}

}

module.exports = function() {
	console.log('Starting Sonos service');
	var sonosWSDL = fs.readFileSync('./lib/Sonos.wsdl', 'utf8');
	var server = http.createServer(function(request,response){
		console.log('HTTP: received request: %j',request);
		response.end("404: Not Found: "+request.url);
	});

	server.listen(8080);
	soap.listen(server,'/sonos',sonosService,sonosWSDL);
	server.log = function(data, type){
		console.log('Data: ' + data + '\n' + 'Type: ' + type);
	}
};