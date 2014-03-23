var request = require('request');

var Airtel=function(api_key,api_secret){
	this.end_point='http://portals.bd.airtel.com/msdpapi';
	this.api_key=api_key;
	this.api_secret=api_secret;
	this.send=function (message, callback){
		request.post({			
			url:		this.end_point+'?REQUESTTYPE=SMSSubmitReq&USERNAME='+this.api_key+'&PASSWORD='+this.api_secret+'&TYPE=0&ORIGIN_ADDR='+message.from+'&MOBILENO='+message.to+'&MESSAGE='+encodeURIComponent(message.body)
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