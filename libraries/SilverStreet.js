var request = require('request');

var SilverStreet=function(api_key,api_secret){
	this.end_point='http://api.silverstreet.com/send.php';
	this.api_key=api_key;
	this.api_secret=api_secret;
	this.send=function (message, callback){
        var form={ username: this.api_key, password: this.api_secret, destination: message.to, body: message.body };

        if(message.from!='')
            form.sender=message.from;

        if(message.reference!='')
            form.reference=message.reference;

		request.post({
			headers:	{'content-type' : 'multipart/form-data'},
			url:		this.end_point,
			form:		form
		}, function(error, response, body){
			//console.log(response);
            if(body=='01')
                callback(1);
            else
                callback(0);
			console.log(body);
		});
	}
}

module.exports = Synergy;