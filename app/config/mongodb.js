var assert = require('assert');
	MongoClient = require('mongodb').MongoClient,
	// url         = 'mongodb://2school666:25ch001666@ds043324.mongolab.com:43324/2school',
	url         = 'mongodb://localhost/encuestas';

// Test connection
module.exports.testConnection = function(callback){
	callback.starting();
    module.exports.ejecute(function(err, db) { 
        assert.equal(null, err);
        callback.success();
        db.close();
    });
};

module.exports.ejecute = function (handler) {
	MongoClient.connect(url, handler);
};