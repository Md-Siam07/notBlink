require('./config/config')
require('./models/db');
require('./config/passportConfig');
require('./models/notification');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
//const io = require('socket.io')(3000);

const routeIndex = require('./routes/index.router');

var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: '*'
});

//middleware
//app.use(require('connect').bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cors());
app.use('/public', express.static('public'))
app.use(passport.initialize());
app.use('/api', routeIndex);


//error handler
app.use((err, req, res, next) => {
    if(err.name == 'ValidationError'){
        var valErrors = [];
        Object.keys(err.errors).forEach( key => valErrors.push(err.errors[key].message) );
        res.status(422).send(valErrors)
    }
});

//start server
server.listen(process.env.PORT, () => console.log(`Server started at port: ${process.env.PORT}`));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('notification', notification =>{
    console.log('ashche');
    io.emit('notification', notification);
  })
})

//app.use('/exams', examController); 
