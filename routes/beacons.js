var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('beaconsTermProject', server, {w:1}); // {w:1} kısmı Please ensure that you set the default write concern for the database by setting    =
                                                  // =   one of the options uyarısı üzerine eklendi

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'beaconsTermProject' database");
        db.collection('beacons', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'beacons' collection doesn't exist....");

            }
        });
    }
});

// get user by userId
router.get('/list', function(req, res) {

	db.collection('beacons', function(err, collection)
    {
        collection.find().toArray(function(err, items)
        {
            res.send(items);
            console.log(items);
        });
    });
});

// create a user
router.post('/add', function(req, res) {

    /*var beacons = [
        {
            name: "beacon test2",
            id: "32409284"
        },
        {
            name: "beacon test2",
            id: "2347298"
        }];*/
    
	var beacon = req.body;
    console.log('Success: ' + req.body);
	db.collection('beacons', function(err, collection) {
        console.log('Error : ' + err);
        collection.insert(beacon, {safe:true}, function(err, result)
        {
            if (err)
            {
                res.send({'error':'An error has occurred'});
            }
            else
            {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
	
});

module.exports = router;
