
// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var http = require('http').Server(app);

var app = express();


// Listen : localhost:3000
var server = app.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});

// soket.io
var io = require('socket.io').listen(server);
io.on('connection', () =>{
  console.log('a user is connected')
})



// Mongo db
var dbUrl = '****'

mongoose.set('useUnifiedTopology', true);
mongoose.connect(dbUrl, { useNewUrlParser: true } , (err) => { 
    console.log('mongodb connected',err);
})
var Message = mongoose.model('Message',{ name : String, message : String});




// Uses
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))




app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
})


app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      io.emit('message', req.body);
      res.sendStatus(200);
    })
  })



