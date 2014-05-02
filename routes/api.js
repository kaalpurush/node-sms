var Sms = require('../libraries/Sms');

/*
 * GET home page.
 */ 
exports.index = function (req, res) {
    res.send(200, 'SMS Gateway API!');
}

exports.send = function (req, res) {
    var api_key = req.body.api_key;
    var api_secret = req.body.api_secret;
	var api_origin = req.get('origin');
	
	var gateway=req.params.sms_gateway;
	
	var sms=new Sms(gateway);

	try{
		sms.authenticate({api_key: api_key, api_secret: api_secret, api_origin: api_origin},
			function () {
				sms.send(req, function (report) {
					console.log(report);
				});
				res.json({total:req.body.messages.length});				
			},
			function () {
				res.json({error: 'Auth Error!'});
			}
		);
	}catch(e){sms.cleanUp();}
}

exports.report = function (req, res) {
    //console.log(req.body);
    var api_key = req.body.api_key;
    var api_secret = req.body.api_secret;
	var api_origin = req.get('origin');
	
    var day = req.body.day;
    var month = req.body.month;
    var year = req.body.year;
	
	var gateway=req.params.sms_gateway;	
	var sms=new Sms(gateway);
	
	try{
		sms.authenticate({api_key: api_key, api_secret: api_secret, api_origin: api_origin},
			function () {
				sms.showReport(day, month, year, function (report) {
					res.json(report);
				});
			},
			function () {
				res.json({error: 'Auth Error!'});
			}
		);
	}catch(e){sms.cleanUp();}
}