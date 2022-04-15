const { response } = require('express');
const mongoose = require('mongoose');
const Exam = mongoose.model('Exam');

module.exports.create = (req, res, next) => {
    var exam = new Exam();
    exam.examName = req.body.examName;
    exam.startTime = req.body.startTime;
    exam.duration = req.body.duration;
    exam.examDate = req.body.examDate;
    exam.teacherID = req.body.teacherID;
    exam.teacherName = req.body.teacherName;
    exam.participants = [];

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
    var exam = {
        examName: req.body.examName,
        participants: req.body.participants,
        startTime: req.body.startTime,
        duration: req.body.duration,
        examDate: req.body.examDate,
        teacherID: req.body.teacherID,
        teacherName: req.body.teacherName
    };

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
    Exam.findByIdAndUpdate(req.params.id, {$push: {participants: userID}}, {new:true}, (err, doc) =>{
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

