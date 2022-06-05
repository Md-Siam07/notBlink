require('./config/config')
require('./models/db');
require('./config/passportConfig');
require('./models/notification');
const mongoose = require('mongoose');
const Exam = mongoose.model('Exam');
const Notification = mongoose.model('Notification');

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
  var name = '', email = '', examID = '';
  //console.log('a user connected');
  socket.on('notification', notification =>{
    //console.log('ashche');
    io.emit('notification', notification);
  })

  socket.on('newUser', userName => {
    console.log('user', userName)
    //socket.id = user._id;
    name = userName;
    //email = user.email;
  })

  socket.on('newUserEmail', iemail => {
    console.log('email: ', iemail)
    email = iemail;
  })

  socket.on('examID', exID =>{
    examID = exID;
  })

  socket.on('disconnect', () => {
    var notification = new Notification();
    notification.fullName = name;
    notification.email = email;
    notification.time = Date.now;
    notification.phone_number = '';
    notification.roll = 0;
    notification.batch  = 0;
    notification.institute = '';
    notification.cameraRecord = '';
    notification.screenRecord = '';
    notification.message = 'user: ' + name + ' email: ' + email + ' got disconnected';
    // Exam.findByIdAndUpdate(mongoose.Types.ObjectId(examID), {$push: {notification: notification}}, {new:true}, (err, doc) => {
    //   if(!err) {
    //       console.log('added')
    //       res.send(doc);}
    //   else{
    //       console.log(`Error in add evidence: `+ JSON.stringify(err, undefined, 2));
    //   }
    // })
    // Exam.findOne({_id: examID}, (err, res) => {
    //   if(err){
    //     console.log(`Error in add evidence: `+ JSON.stringify(err, undefined, 2));
    //   }
    //   if(res){
    //     res.update( $push: {notification: notification})
    //   }
    // })
    if (!examID.match(/^[0-9a-fA-F]{24}$/)) {
      // invalid id
    }
    else{
      Exam.findOneAndUpdate( {_id: examID}, {$push:{notification:notification}}, {new:true}, (err, res) =>{
        if(res) 
          console.log('add disc successfully')
        else
          console.log('err in disconnect ', JSON.stringify(err, undefined,2))
      })
    }
    
  })
})

//app.use('/exams', examController); 