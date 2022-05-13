const mongoose = require('mongoose');

var ExamSchema = new mongoose.Schema({
    examName:{
        type: String,
        required: 'Exam name can\'t be emtpy',
    },
    startTime:{
        type:String
    },
    duration:{
        type:Number
    },
    examDate:{
        type:String
    },
    message:{
        type:String
    },
    teacherID:{
        type: String
    },
    participants:{
        type: Array
    },
    teacherName:{
        type: String
    },
    question:{
        type: String
    }
});

mongoose.model('Exam', ExamSchema);