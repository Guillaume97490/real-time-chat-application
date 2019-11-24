const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const server = app.listen(3000, () => console.log('server is running on port', server.address().port));
const path = require('path');

// soket.io
const io = require('socket.io').listen(server);
io.on('connection', () => console.log('a user is connected'))
global.io = io;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

require('./config/routes.js')(app);