const mongoose = require('mongoose');

// var Teacher = mongoose.model('Teacher', {
//     name: {type:String},
//     position: {type: String},
//     office: {type: String},
//     salary: {type: String}
// });

//module.exports = { Teacher };

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
    }
});

mongoose.model('Exam', ExamSchema);