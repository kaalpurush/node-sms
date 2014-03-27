var request = require('request');

var SilverStreet=function(api_key,api_secret){
	this.end_point='http://api.silverstreet.com/send.php';
	this.api_key=api_key;
	this.api_secret=api_secret;
	this.send=function (message, callback){
        var form={ username: this.api_key, password: this.api_secret, bodytype:4, sender: message.from, destination: message.to, body: message.body };

        if(typeof message.reference!='undefined' && message.reference!='')
            form.reference=message.reference;

		request.post({
			headers:	{'content-type' : 'application/x-www-form-urlencoded'},
			url:		this.end_point,
			form:		form
		}, function(error, response, body){
            if(body=='01')
                callback(1);
            else
                callback(0);
			console.log(body);
		});
	}
}

module.exports = SilverStreet;