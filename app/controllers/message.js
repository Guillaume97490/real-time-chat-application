let Message = require('../models/message')

exports.index = (req,res)=> {
  res.render('index.ejs', {
    title: 'Accueil'
  })
}

exports.list = (req, res) => {
    Message.find({},(err, messages)=> res.send(messages))
};


exports.add = (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      return res.status(500).json({error: 'Une erreur est survenue'});
    req.body._id = message._id
    global.io.emit('message', req.body);
    res.sendStatus(200);
  })
};

exports.delete = (req,res) => {
  Message.findByIdAndRemove(req.params.id, (err)=>{
    if (err)
      return res.status(500).json({error: 'Une erreur est survenue'});
    global.io.emit('delMsg', req.params.id);
    res.sendStatus(200);
  })
};

exports.update = (req,res)=> {
  Message.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    message: req.body.message
  },
  (err)=>{
    if (err)
      return res.status(500).json({error: 'Une erreur est survenue'});
    global.io.emit('updMsg', req.body);
    res.sendStatus(200);
  })
};