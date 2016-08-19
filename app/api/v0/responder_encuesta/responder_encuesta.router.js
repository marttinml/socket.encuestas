module.exports = function (io) {
    var ResponderEncuesta = require('./responder_encuesta.controller');
    
   var indicadores = io.on('connection', function (socket) {
      
        socket.on('event-responder-encuesta', function (data) {
            ResponderEncuesta.indicadores(data.id,function(result){
                indicadores.emit('update-indicadores', result);
            });
        });

    });

};