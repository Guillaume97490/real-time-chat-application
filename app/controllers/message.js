let Message = require('../models/message');
const validator = require('validator');
const moment = require('moment');
require('moment/locale/fr');
moment.updateLocale('fr', {calendar : {sameElse : 'DD MMM YYYY'}});

dayFormat = (dayToDisplay) => {
  let date = moment(dayToDisplay);
  if (moment().diff(date, 'days') >= 1 && moment().diff(date, 'days') <= 7) {
    return date.fromNow();
  };
  return date.calendar().split(' à ')[0];
}

exports.index = (req,res)=> res.render('index.ejs', {title: 'Accueil'});

exports.list = (req, res) => {
    Message.find({},(err, messages) => {
      messages.forEach(message => {
        createdAt = message.createdAt;
        message.createdAt = moment(createdAt).format('HH:mm');
        message.day = dayFormat(createdAt);
        // message.day = moment(createdAt).calendar().split(" à ")[0];
      });
    res.send(messages);
}).lean().sort({createdAt: 1});
};


exports.add = (req, res) => {
  req.body.createdAt = moment();
  req.body.name = validator.escape(req.body.name);
  req.body.message = validator.escape(req.body.message);
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      return res.status(500).json({error: 'Une erreur est survenue'});
    req.body._id = message._id;
    req.body.createdAt = moment(message.createdAt).format('HH:mm');
    req.body.day = dayFormat(moment());
    global.io.emit('message', req.body);
    res.sendStatus(200);
  });
};

exports.delete = (req,res) => {
  Message.findByIdAndRemove(req.params.id, (err)=>{
    if (err)
      return res.status(500).json({error: 'Une erreur est survenue'});
    global.io.emit('delMsg', req.params.id);
    res.sendStatus(200);
  });
};

exports.update = (req,res)=> {
  req.body.name = validator.escape(req.body.name);
  req.body.message = validator.escape(req.body.message);
  Message.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    message: req.body.message
  },(err)=>{
      if (err)
        return res.status(500).json({error: 'Une erreur est survenue'});
      global.io.emit('updMsg', req.body);
      res.sendStatus(200);
  });
};