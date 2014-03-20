var request = require('request');

var Synergy=function(api_key,api_secret){
	this.end_point='http://bulksms.synergyinterface.com/sms_db/bulk_send_api.php';
	this.api_key=api_key;
	this.api_secret=api_secret;
	this.send=function (from, to, message, callback){
		request.post({
			headers:	{'content-type' : 'multipart/form-data'},
			url:		this.end_point,
			form:		{ key: this.api_key, countrycode: 'BD', numbers: to, message: message }
		}, function(error, response, body){
			//console.log(response);
            try{
                var ret=JSON.parse(body);
            }catch(e){}
            if(typeof ret!='undefined' && ret.return=='true')
                callback(1);
            else
                callback(0);
			console.log(body);
		});
	}
}

module.exports = Synergy;