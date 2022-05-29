const e = require('express');
const { response } = require('express');
const mongoose = require('mongoose');
const Exam = mongoose.model('Exam');
const multer = require('multer');




module.exports.create = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    //console.log('called');
    //console.log('body: ' , req.body);
    var exam = new Exam();
    exam.examName = req.body.examName;
    exam.startTime = req.body.startTime;
    exam.duration = req.body.duration;
    exam.examDate = req.body.examDate;
    exam.teacherID = req.body.teacherID;
    exam.teacherName = req.body.teacherName;
    exam.outSightTime = req.body.outSightTime;
    exam.participants = [];
    exam.notification = [];
    if(!req.file)
        exam.question = '';
    else
        exam.question = url + '/public/' + req.file.filename;
    //exam.question = req.file.filename;
    console.log(exam);
    exam.save( (err, doc) =>{
        if(!err)
            res.send(doc);
        else 
            console.log('Error in Exam Save: ' + JSON.stringify(err, undefined, 2));
    }  );
}

module.exports.retrieve = (req, res, next) => {
    Exam.find({ teacherID: req.params.id }, (err, doc) =>{
        if(!err) res.send(doc);
        else {
            console.log(`Error in exam retrive: `+ JSON.stringify(err, undefined, 2));
        }
    } ) 
}

module.exports.getStudentExams = (req, res, next) => {
    Exam.find({ participants: req.params.id}, (err, doc) =>{
        if(!err) res.send(doc);
        else{
            console.log(`Error in retriving exam of students`);
        }
    })
}


module.exports.singleExamInfo = (req, res, next) => {
    Exam.findById(req.params.id, (err, doc) => {
        if(!err) res.send(doc);
        else {
            console.log(`Error in retriving exam`);
        }
    } )
}

module.exports.updateInfo = (req, res, next) => {
    //console.log(req.body);
    const url = req.protocol + '://' + req.get('host')
    var tempQuestion;
    Exam.findById(req.params.id, (err, doc) => {
        if(!err) tempQuestion = doc.question;
        else {
            console.log(`Error in retriving exam`);
        }
    } )
    console.log('called');
    console.log('body: ' , req.body);
    if(req.file){
        tempQuestion = url + '/public/' + req.file.filename;
    }
    var exam = {
        examName: req.body.examName,
        participants: req.body.participants,
        startTime: req.body.startTime,
        duration: req.body.duration,
        examDate: req.body.examDate,
        teacherID: req.body.teacherID,
        teacherName: req.body.teacherName,
        question : tempQuestion,
        outSightTime: req.body.outSightTime
    };
    //exam.question = url + '/public/' + req.file.filename;

    Exam.findByIdAndUpdate(req.params.id, { $set:exam }, { new:true } , (err, doc) => {
        if(!err) {res.send(doc);}
        else{
            console.log(`Error in exam update: `+ JSON.stringify(err, undefined, 2));
        }
    });
}

module.exports.deleteExam = (req, res, next) => {
    Exam.findByIdAndDelete(req.params.id, (err, doc) => {
        if(!err) { res.send(doc); }
        else { console.log('Error in exam delete: ' + JSON.stringify(err, undefined, 2)); }
    })
}

module.exports.joinExam = (req, res, next) => {
    var userID = req.body.userID;
    console.log(req.body);
    console.log(userID);
    Exam.findByIdAndUpdate(req.params.id, {$addToSet: {participants: userID}}, {new:true}, (err, doc) =>{
        if(!err) {res.send(doc);}
        else{
            console.log(`Error in exam join: `+ JSON.stringify(err, undefined, 2));
        }
    } )
}

module.exports.removeParcipant = (req, res, next) => {
    Exam.findByIdAndUpdate(req.params.id, {$pull: {participants: {$in: [req.body.userID]}}}, {new:true}, (err, doc) =>{
        if(!err) {res.send(doc);}
        else{
            console.log(`Error in exam leave: `+ JSON.stringify(err, undefined, 2));
        }
    } )
}

module.exports.addEvidence = (req, res, next) => {
    var myNotification = {
        examinee:{
            fullName: req.body.fullName,
            email: req.body.email, 
            institute: req.body.institute,
            batch: req.body.batch,
            roll: req.body.roll,
            phone_number: req.body.phone_number,
        },
        cameraRecord:req.body.cameraRecord,
        screenRecord:req.body.screenRecord,
        message:req.body.message
    }
    console.log(req.body);
    console.log(myNotification);
    Exam.findByIdAndUpdate(req.params.id, {$push: {notification: myNotification}}, {new:true}, (err, doc) => {
        if(!err) {res.send(doc);}
        else{
            console.log(`Error in add evidence: `+ JSON.stringify(err, undefined, 2));
        }
    })
}

module.exports.getNotification = (req, res, next) => {

}

