// IMPORT DES CONTROLLERS

var message = require('../app/controllers/message');

module.exports = function (app) {

  app.get('/', message.index);

  app.get('/messages', message.list);
  
  app.post('/messages', message.add);
  
  app.get('/message/:id/delete', message.delete);
  
  app.post('/message/:id', message.update);

}