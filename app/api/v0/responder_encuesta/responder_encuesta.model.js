var ObjectId = require('mongodb').ObjectID;
var collectionName = "responder_encuesta";


module.exports.create = function(db, data, callback) {
  //var valid = Util.validateModel(data, { required:['key'], number:['key'], string:['name','description'] });
  var valid = true;
  
  if(valid){
      db.collection(collectionName).insertOne( {
          encuesta        : data.encuesta,
          preguntas       : data.preguntasList,
          tipoEncuesta    : data.tipoEncuesta,
          usuario         : 0,
          date            : new Date()
      }, function(err, result){
          result.ops[0].id = result.ops[0]._id;
          delete result.ops[0]._id;
          delete result.ops[0].date;  
          callback(err, result.ops[0], 200);
      } );

  }else{
    callback(null, 'Invalid Model', 201);
  }
};

module.exports.retrieve = function(db, callback) {
   var result = [];
   var cursor = db.collection(collectionName).find({});
   cursor.each(function(err, doc) {
      if (doc != null) {
          doc.id = doc._id;
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
   var cursor = db.collection(collectionName).find({ _id : ObjectId(id) });
   cursor.each(function(err, doc) {
      if (doc != null) {
          doc.id = doc._id;
          delete doc._id;
          delete doc.date;
          result.push(doc);
      } else {
         callback(result[0]);
      }
   });
};

module.exports.update = function(db, id, data, callback) {
   db.collection(collectionName).updateOne(
        { _id : ObjectId(id) },
        {
          $set: data,
          $currentDate: { "lastModified": true }
        },function(err, results) {
            callback(err, data, 200);
        }
    );
};

module.exports.replace = function(db, id, data, callback) {
   db.collection(collectionName).replaceOne(
        { _id : ObjectId(id) },
        data
        ,function(err, results) {
            data.id = id;
            callback(err, data, 200);
        }
    );
};

module.exports.delete = function(db, id, callback) {
  
  module.exports.detail(db, id, function(result){
      db.collection(collectionName).deleteMany(
        { _id : ObjectId(id) },
        function(err, results) {
            callback(err, results, 200);
        }
    );
  });
   
};

module.exports.indicadores = function(db, encuesta, callback) {
   var result = {encuesta:encuesta.id, mensaje:"", respondida:0};
   var cursor = db.collection(collectionName).find(
      { 
        "encuesta.id" : Number(encuesta.id)
      }
    );
   encuesta.graficas = [];
   for(var i in encuesta.preguntas[0].respuestas){
        var respuesta = encuesta.preguntas[0].respuestas[i];
        encuesta.graficas[i] = {};
        encuesta.graficas[i].name = encuesta.tipoEncuesta.id === 1 ? respuesta.name : respuesta.categoria;
        encuesta.graficas[i].porcentaje = 0;
   }
      
   cursor.each(function(err, doc) {
      if (doc != null) {
          doc.id = doc._id;
          delete doc._id;
          delete doc.date;
          for(var i in doc.preguntas){
            var pregunta = doc.preguntas[i];

            for(var j in  encuesta.graficas){
                var categoria = encuesta.graficas[j];
                if(encuesta.tipoEncuesta.id === 1){
                    if(categoria.name === pregunta.respuesta.name){
                      categoria.porcentaje++;
                    }
                }else{
                    if(categoria.name === pregunta.respuesta.categoria){
                      categoria.porcentaje++;
                    }
                }
            }
          }
          result.respondida++;
      } else {
        for(var j in  encuesta.graficas){
                var categoria = encuesta.graficas[j];
                categoria.porcentaje = (categoria.porcentaje/(result.respondida*encuesta.preguntas.length))*100;
        }
         // result.respondida = result.respondida + " Veces";
         callback(encuesta);
      }
   });
};


