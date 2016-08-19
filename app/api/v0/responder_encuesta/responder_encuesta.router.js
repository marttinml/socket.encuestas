module.exports = function (io) {
    var ResponderEncuesta = require('./responder_encuesta.controller');
    
    io.on('connection', function (socket) {
      
      socket.on('event-responder-encuesta', function (data) {
            console.log(data);
            ResponderEncuesta.indicadores(data.id,function(result){

                socket.emit('update-indicadores', result);
            });
      });

    });

};