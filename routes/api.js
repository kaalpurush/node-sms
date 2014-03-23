var config = require('../config/');
var MongoClient = require('mongodb').MongoClient;
var Synergy = require('../libraries/Synergy');
var Airtel = require('../libraries/Airtel');
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.send(200, 'SMS Gateway API!');
}

exports.create = function (req, res) {
    MongoClient.connect(config.mongo.connection, function (err, db) {
        if (err) throw err;
        db.collection('clients').update({api_key: '1'}, {$set: {name: 'Client 1', api_key: '1', api_secret: '1028c3247c0e2d2496fd220984d419e8'}}, {upsert: true}, function (err, objects) {
            if (err) throw err;
            res.end('created!');
        });
    });
}

function authenticate(cred, success, fail) {
    MongoClient.connect(config.mongo.connection, function (err, db) {
        if (err) throw err;
        var collection = db.collection('clients');
        collection.findOne({api_key: cred.api_key, api_secret: cred.api_secret}, function (err, item) {
            if (item)
                success();
            else
                fail();

        });
    });
}

function send(req, callback) {
    var sms_gateway=req.params.sms_gateway||config.default_sms_gateway;
    var messages=req.body.messages;

    if(sms_gateway=='synergy')
        sms_gateway = new Synergy(config.synergy.api_key, config.synergy.api_secret);
    else if(sms_gateway=='airtel')
        sms_gateway = new Airtel(config.airtel.api_key, config.airtel.api_secret);
    else if(sms_gateway=='silverstreet')
        sms_gateway = new SilverStreet(config.silverstreet.api_key, config.silverstreet.api_secret);

    for (i in messages) {
        var message = messages[i];
        var processed = 0, success = 0, failed = 0;

        message.from = message.from || '';

        sms_gateway.send(message, function (status) {
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

function showReport(api_key, day, month, year, callback) {
    MongoClient.connect(config.mongo.connection, function (err, db) {
        if (err) throw err;
        var collection = db.collection('reports');
        var conditions = {};
        if (day)
            conditions.day = day;
        if (month)
            conditions.month = month;
        conditions.year = year;
        console.log(conditions);
        collection.find(conditions).sort({year: -1, month: -1, day: -1}).toArray(function (err, results) {
            callback(results);
        });
    });
}

function addReport(api_key, day, month, year, report, callback) {
    MongoClient.connect(config.mongo.connection, function (err, db) {
        if (err) throw err;
        db.collection('reports').update({api_key: api_key, day: day, month: month, year: year}, {$inc: report}, {upsert: true}, function (err, objects) {
            if (err) throw err;
        });
    });
}

exports.send = function (req, res) {
    var api_key = req.body.api_key;
    var api_secret = req.body.api_secret;

    authenticate({api_key: api_key, api_secret: api_secret},
        function () {
            send(req, function (report) {
                var date = new Date;
                addReport(api_key, date.getDate(), date.getMonth() + 1, date.getFullYear(), report);
                //res.json(report);
            });
            res.json({total:req.body.messages.length});
        },
        function () {
            res.json({error: 'Auth Error!'});
        }
    );
}

exports.report = function (req, res) {
    console.log(req.body);
    var api_key = req.body.api_key;
    var api_secret = req.body.api_secret;
    var day = req.body.day;
    var month = req.body.month;
    var year = req.body.year;
    authenticate({api_key: api_key, api_secret: api_secret},
        function () {
            showReport(api_key, day, month, year, function (report) {
                res.json(report);
            });
        },
        function () {
            res.json({error: 'Auth Error!'});
        }
    );
}