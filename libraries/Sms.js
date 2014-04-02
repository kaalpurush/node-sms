var MongoClient = require('mongodb').MongoClient;
var Synergy = require('Synergy');
var Airtel = require('Airtel');
var SilverStreet = require('SilverStreet');

var Sms=function(gateway,connection){
	var self=this;
	var connected=false;
	
	this.connectDB=function(callback){
		if(connected)
			callback();
		else
			MongoClient.connect(connection, function (err, db) {
				if (err) throw err;
				self.db=db;
				connected=true;
				callback();
			});
	}
	
	this.closeDB=function(){
		if(connected)
			self.db.close();
		connected=false;
	}

	this.authenticate=function(cred, success, fail) {
		var collection = self.db.collection('clients');
		collection.findOne({api_key: cred.api_key, api_secret: cred.api_secret, api_origin: cred.api_origin}, function (err, item) {
			if (err) throw err;
			if (item)
				success();
			else
				fail();
		});
	}
	
	this.send=function(req, callback) {		
		var messages=req.body.messages;

		if(gateway=='synergy')
			this.gateway = new Synergy(config.synergy.api_key, config.synergy.api_secret);
		else if(gateway=='airtel')
			this.gateway = new Airtel(config.airtel.api_key, config.airtel.api_secret);
		else if(gateway=='silverstreet')
			this.gateway = new SilverStreet(config.silverstreet.api_key, config.silverstreet.api_secret);

		for (i in messages) {
			var message = messages[i];
			var processed = 0, success = 0, failed = 0;

			message.from = message.from || config.default_sms_sender;

			this.gateway.send(message, function (status) {
				processed++;
				if (status == 0)
					failed++;
				else
					success++;
				if (processed == messages.length)
					callback({total: messages.length, success: success, failed: failed});
			});
		}
	}
		
	this.addReport=function(api_key, day, month, year, report, callback) {
		self.db.collection('reports').update({api_key: api_key, day: day, month: month, year: year}, {$inc: report}, {upsert: true}, function (err, objects) {
			if (err) throw err;
			callback();
		}); 	
	}
	
	this.showReport=function(api_key, day, month, year, callback) {
		var collection = self.db.collection('reports');
		var conditions = {};
		if (day)
			conditions.day = day;
		if (month)
			conditions.month = month;
		conditions.year = year;
		//console.log(conditions);
		collection.find(conditions).sort({year: -1, month: -1, day: -1}).toArray(function (err, results) {
			if (err) throw err;
			callback(results);
		});
	}

}

module.export=Sms;