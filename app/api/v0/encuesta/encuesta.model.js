var ObjectId = require('mongodb').ObjectID;
var autoIncrement = require("mongodb-autoincrement");


module.exports.create = function(db, data, callback) {
  //var valid = Util.validateModel(data, { required:['key'], number:['key'], string:['name','description'] });
  var valid = true;
  var collectionName = "encuestas";
  if(valid){

  autoIncrement.getNextSequence(db, collectionName, function (err, autoIndex) {

      var direccionObj = { id:data.direccion.id, name: data.direccion.name}; 
      var tipoEncuestaObj = { id:data.tipoEncuesta.id, name: data.tipoEncuesta.name}; 
      var preguntasList = [];
      data.preguntas = data.preguntas || [];
      for(var i in data.preguntas){
        var pregunta = {};

        pregunta.id = data.preguntas[i].id;
        pregunta.pregunta = data.preguntas[i].pregunta;
        pregunta.respuestas = data.preguntas[i].respuestas || [];
        preguntasList.push(pregunta);
      }

      db.collection(collectionName).insertOne( {
          id              : autoIndex,
          titulo          : data.titulo,
          descripcion     : data.descripcion,
          direccion       : direccionObj,
          valides         : new Date(data.valides),
          tiempo          : data.tiempo,
          tipoEncuesta    : tipoEncuestaObj,
          preguntas       : preguntasList,
          autor           : "unknow",
          date            : new Date()
      }, function(err, result){
          // result.ops[0].id = result.ops[0]._id;
          delete result.ops[0]._id;
          delete result.ops[0].date;  
          callback(err, result.ops[0], 200);
      } );

    });
  }else{
    callback(null, 'Invalid Model', 201);
  }
};

module.exports.retrieve = function(db, callback) {
   var result = [];
   var cursor = db.collection('encuestas').find({});
   cursor.each(function(err, doc) {
      if (doc != null) {
          // doc.id = doc._id;
          delete doc._id;
          delete doc.date;
          result.push(doc);
      } else {
         callback(result);
      }
   });
};

module.exports.detail = function(db, id, callback) {
   var result = [];
   var cursor = db.collection('encuestas').find({ id : Number(id) });
   cursor.each(function(err, doc) {
      if (doc != null) {
          // doc.id = doc._id;
          delete doc._id;
          delete doc.date;
          result.push(doc);
      } else {
         callback(result[0]);
      }
   });
};

module.exports.update = function(db, id, data, callback) {
   db.collection('encuestas').updateOne(
        { id : Number(id) },
        {
          $set: data,
          $currentDate: { "lastModified": true }
        },function(err, results) {
            callback(err, data, 200);
        }
    );
};

module.exports.replace = function(db, id, data, callback) {
   db.collection('encuestas').replaceOne(
        { id : Number(id) },
        data
        ,function(err, results) {
            data.id = id;
            callback(err, data, 200);
        }
    );
};

module.exports.delete = function(db, id, callback) {
  
  module.exports.detail(db, id, function(result){
      db.collection('encuestas').deleteMany(
        { id : Number(id) },
        function(err, results) {
            callback(err, results, 200);
        }
    );
  });
   
};