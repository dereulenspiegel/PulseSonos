var http = require('http');
var querystring = require('querystring');


module.export = {
	registerService: function(service, sonosIp){

		var postData = querystring.stringify({
			//TODO map to fields in form
		});
		postToSonos(postData,sonosIp);
	},

	unregisterService: function(serviceId, sonosIp) {

	},

	postToSonos: function(postData, sonosIp){
		var request = http.request({
			host: sonosIp,
			port: 1400,
			path: '/customsd',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length
			}
		}, function(res){

		});

		request.on('error', function(error){
			console.log('Error while (un)registering custom Music Service: %j', error);
		});

		request.write(service);
		request.end();
	}
}