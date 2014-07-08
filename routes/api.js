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
	
	if(typeof req.body.messages=='undefined' || req.body.messages.length==0)
		return res.json({error: 'No message in input!'});
	
	var sms=new Sms(gateway);
	
	sms
	.authenticate({api_key: api_key, api_secret: api_secret, api_origin: api_origin})
	.catch(function (err) {
		res.json({error: 'Auth Error!'});
		sms.cleanUp();
		throw err;
	})
	.then(function () {
		res.json({total:req.body.messages.length});
		return sms.send(req);		
	})
	.catch(function (err) {
		res.json({error: 'Report Error!'});
		sms.cleanUp();
		throw err;
	})	
	.then(function(report) {
		console.log(report);
	});
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
	
	sms.authenticate({api_key: api_key, api_secret: api_secret, api_origin: api_origin})
	.catch(function (err) {
		res.json({error: 'Auth Error!'});
		sms.cleanUp();
		throw err;
	})
	.then(function () {
		return sms.showReport(day, month, year);
	})
	.catch(function (err) {
		res.json({error: 'Report Error!'});
		sms.cleanUp();
		throw err;
	})
	.then(function(report){
		res.json(report);
	})

}