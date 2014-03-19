var request = require('request');

var Airtel=function(api_key,api_secret){
	this.end_point='http://portals.bd.airtel.com/msdpapi';
	this.api_key=api_key;
	this.api_secret=api_secret;
	this.send=function (to, message, callback){
		request.post({			
			url:		this.end_point+'?REQUESTTYPE=SMSSubmitReq&USERNAME='+this.api_key+'&PASSWORD='+this.api_secret+'&MOBILENO='+to+'&MESSAGE='+encodeURIComponent(message)
		}, function(error, response, body){
            if(body.indexOf('Accepted')!==false)
                callback(1);
            else
                callback(0);
			console.log(body);
		});
	}
}

module.exports = Airtel;