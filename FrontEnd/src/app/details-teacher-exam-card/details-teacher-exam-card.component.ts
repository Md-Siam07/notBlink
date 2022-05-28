import { Component, OnInit } from '@angular/core';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-details-teacher-exam-card',
  templateUrl: './details-teacher-exam-card.component.html',
  styleUrls: ['./details-teacher-exam-card.component.css']
})
export class DetailsTeacherExamCardComponent implements OnInit {

  month: string = "";
  selectedExam = new Exam();
  recipientEmail: string = "";
  kickParticipant = new User();
  file!: File;
  months =  new Map([
    [1, "JAN"],
    [2, "FEB"],
    [3, "MAR"],
    [4, "APR"],
    [5, "MAY"],
    [6, "JUN"],
    [7, "JUL"],
    [8, "AUG"],
    [9, "SEP"],
    [10, "OCT"],
    [11, "NOV"],
    [12, "DEC"]
  ]);

  model = {
    examCode: this.selectedExam._id,
    recipiennt: ''
  }

  kickModel = {
    examCode: '',
    userID: '',
    examName: ''
  }

  constructor(private examService: ExamService) { }
  examDetails = new Exam();
  participants: User[] = [];
  tempUser !:User;
  participantSet = new Set<string>();

  ngOnInit(): void {
    this.refreshParticipantList();
    this.examDetails = this.examService.selectedExam;
    console.log(this.examDetails);
    //console.log('here: ', this.examDetails.question);
  }

  uploadFile(event:any) {
    this.file = event.target.files[0]; 
  }

  getExamDate(input: string): string{
    return input.substring(8,10);
  }

  getExamMonth(input: string): any{
    this.month = input.substring(5,7);
    //console.log('month: '+ this.month);
    return this.months.get(parseInt(this.month));
  }

  getPartipantList(exam: Exam){

  }

  refreshParticipantList(){
    this.participantSet = new Set<string>();
    this.participants = [];
    this.examDetails = this.examService.selectedExam;
    this.examDetails.participants.forEach(participantID => {
      this.participantSet.add(participantID);
    });
    this.participantSet.forEach(participantID => {
      this.examService.getParticipant(participantID).subscribe(
        (res:any) => {
          //console.log('res: ', res);
          this.tempUser = res as User;
          // this.tempUser.fullName= res.fullName;
          // this.tempUser.email = res.email;
          // this.tempUser._id = res._id;
          // this.tempUser.batch = res.batch;
          // this.tempUser.designation = res.designation;
          // this.tempUser.institute = res.institute;
          // this.tempUser.isTeacher = res.isTeacher;
          // this.tempUser.phone_number = res.phone_number;
          // this.tempUser.roll = res.roll;
          // console.log(this.tempUser);
          this.participants.push(JSON.parse(JSON.stringify(this.tempUser)));
        },
        (err:any) => {}
      );
    });
    console.log(this.participants);
  }

  onClick(exam: Exam){
    this.selectedExam = JSON.parse(JSON.stringify(exam));
  }

  update(){
    this.examService.update(this.selectedExam, this.file).subscribe(
      (res:any) =>{
        console.log('successful');
        //kichu ekta
      },
      err => {
        console.log('Error in updating exam: '+ JSON.stringify(err, undefined, 2));
      }
    )
  }


  delete(){
    this.examService.deleteExam(this.selectedExam).subscribe( (res:any) =>{
      console.log('deleted');
      //navigate
    },
    (err)=>{
      console.log('error in deleting: ' + JSON.stringify(err, undefined, 2));
    } )

  }

  resetForm(){
    this.selectedExam.duration = 0;
    this.selectedExam.examName = "";
    this.selectedExam.examDate = "";
    this.selectedExam.startTime = "";
  }

  invite(){
    this.model.examCode = this.selectedExam._id;
    this.model.recipiennt = this.recipientEmail;
    console.log(this.model.recipiennt);
    this.examService.invite(this.model).subscribe(
      (res:any) =>{
        console.log('sent');
        //this.model.examCode='';
        this.model.recipiennt = '';
      },
      (err) => {
        console.log('error in inviting: '+ err);
      }
    )
  }

  onKick(participant: User){
    this.kickParticipant = participant;
  }

  kick(){
    console.log(this.examDetails, this.kickParticipant)
    this.kickModel.examCode = this.examDetails._id;
    this.kickModel.userID = this.kickParticipant._id;
    this.examService.kickFromExam(this.kickModel, this.kickModel.examCode).subscribe(
      (res:any) =>{
        console.log('successful');
        this.refreshParticipantList();
      },
      (err:any) => {
        console.log('Error in updating exam: '+ JSON.stringify(err, undefined, 2));
      }
    );
    this.refreshParticipantList();
    
  }

}
