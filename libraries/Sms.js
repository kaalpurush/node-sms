var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var config = require('../config/smsconfig');

var Sms=function(sms_gateway){
	var self=this;
	var connected=false;
	var api_key='';
	
	self.gateways=[];
	
	self.sms_gateway=sms_gateway||config.default_sms_gateway;
	
	this.connectDB=function(next){
		if(connected)
			next();
		else
			MongoClient.connect(config.Mongo.connection, function (err, db) {
				if (err) throw err;
				self.db=db;
				connected=true;
				next();
			});
	}
	
	this.closeDB=function(){
		if(connected)
			self.db.close();
		connected=false;
	}
	
	this.cleanUp=function(){
		closeDB();
	}

	this.authenticate=function(cred, success, fail) {
		connectDB(function(){
			var collection = self.db.collection('clients');
			cred.api_origin=cred.api_origin.replace('http://','').replace('https://','').replace('www.','');
			
			collection.findOne({api_key: cred.api_key, api_secret: cred.api_secret, api_origin: cred.api_origin}, function (err, item) {
				if (err) throw err;
				if (item){
					api_key=api_key;
					success();
				}
				else{
					closeDB();
					fail();
				}
			});		
		});
		

	}
	
	this.send=function(req, next) {		
		var messages=req.body.messages;
		
		var processed = 0, success = 0, failed = 0;
		
		async.eachLimit(messages, 10,		
			function(message, callback){
				message.from = message.from || config.default_sms_sender;
				
				self.gateway=this.selectGateway(message.to);

				self.gateway.send(message, function (status) {
					processed++;
					if (status == 0)
						failed++;
					else
						success++;
					callback();
				});
			},
			function(err){
				if(err){
				
				}
				else{
					var report={total: messages.length, success: success, failed: failed};
					var date = new Date;
					addReport(date.getDate(), date.getMonth() + 1, date.getFullYear(), report, function(){
						sms.closeDB();
					});
					next(report);
				}
			}
		);
	}
	
	this.selectGateway=function(to){
		if(to.indexOf('88017')>-1)
			sms_gateway='RouteSms';
		else if(to.indexOf('88016')>-1)
			sms_gateway='SilverStreet';
		else if(to.indexOf('88019')>-1)
			sms_gateway='SilverStreet';
		else if(to.indexOf('88018')>-1)
			sms_gateway='RouteSms';
		else if(to.indexOf('88015')>-1)
			sms_gateway='RouteSms';
		else if(to.indexOf('88011')>-1)
			sms_gateway='RouteSms';
		else
			sms_gateway=self.sms_gateway;
		
		if(typeof self.gateways[sms_gateway]=='undefined'){
			var Gateway=require('./'+sms_gateway);
			self.gateways[sms_gateway]=new Gateway(config[sms_gateway].api_key, config[sms_gateway].api_secret);			 
		}		
		return self.gateways[sms_gateway];		
	}
		
	this.addReport=function(day, month, year, report, next) {
		self.db.collection('reports').update({api_key: api_key, day: day, month: month, year: year}, {$inc: report}, {upsert: true}, function (err, objects) {
			if (err) throw err;
			next();
		}); 	
	}
	
	this.showReport=function(day, month, year, next) {
		var collection = self.db.collection('reports');
		var conditions = {api_key:api_key};
		if (day)
			conditions.day = day;
		if (month)
			conditions.month = month;
		conditions.year = year;
		//console.log(conditions);
		collection.find(conditions).sort({year: -1, month: -1, day: -1}).toArray(function (err, results) {
			closeDB();
			if (err) throw err;			
			next(results);
		});
	}

}

module.exports = Sms;