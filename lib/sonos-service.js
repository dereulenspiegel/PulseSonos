var soap = require('soap');
var fs = require('fs');

// Returns an array with our stream meta data
var getPulseAudioMetadata = function(){
	return {
		[
			{
				id: "a-unique-id",
				mimeType: "TODO: MimeType for MP3 Icecaststreams",
				itemType: "stream",
				streamMetadata: {
					logo: "TODO show a nice Logo URL",
					currentShow: "PulseAudio"
				}
			}
		]
	};
}

var sonosService = {
	Sonos: {
		SonosSoap: {
			getSessionId: function(arguments) {
				return {
					getSessionIdResult: "a-unique-id";
				}
			},

			getMetadata: function(arguments) {

				return {
					getMetadataResult: {
						index: 0,
						count: 1.
						total: 1,

						mediaMetada: getPulseAudioMetadata();
					};
				}
			}

			getExtendedMetadata: function(arguments) {
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
				return {
					getExtendedMetadataTextResult: "PulseSonos Audio Stream"
					
				}
			},

			getStreamingMetadata: function(arguments) {
				return {
					getStreamingMetadataResult: {
						segmentMetadata: {[
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
							]
						}
					}
				}
			},

			getMediaURI: function(arguments) {
				return {
					getMediaURIResult: "TODO M3u URI"
				}
			}
		}
	}

}

module.exports = function() {
	var sonosWSDL = fs.readFileSync('Sonos.wsdl', 'utf8');
	var server = http.createServer(function(request,response){
		response.end("404: Not Found: "+request.url);
	});

	server.listen(8080);
	soap.listen(server,'/sonos',sonosService,sonosWSDL);
	server.log = function(data, type){
		console.log('Data: ' + data + '\n' + 'Type: ' + type);
	}
};