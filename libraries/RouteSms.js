var request = require('request');
var querystring = require('querystring');

var RouteSms=function(api_key,api_secret){
	this.end_point='http://smsplus.routesms.com:8080/bulksms/bulksms?';
	this.api_key=api_key;
	this.api_secret=api_secret;
	this.send=function (message, callback){
        var data={ username: this.api_key, password: this.api_secret, type: '0', dlr: '0', source: message.from, destination: message.to, message: message.body };
		request.get(this.end_point+querystring.stringify(data), function(error, response, body){
			console.log(body);
            if(body.indexOf('1701')>-1)
                callback(1);
            else
                callback(0);			
		});
	}
}

module.exports = RouteSms;