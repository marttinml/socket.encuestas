var assert = require('assert');
	MongoClient = require('mongodb').MongoClient,
	url 		= 'mongodb://digidev404User:Digital1234@ds051595.mlab.com:51595/encuestas';
	//url         = 'mongodb://localhost/encuestas';

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