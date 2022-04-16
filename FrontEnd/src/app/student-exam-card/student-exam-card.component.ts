import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { StudentExamService } from '../shared/student-exam.service';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';

declare var M:any;

@Component({
  selector: 'app-student-exam-card',
  templateUrl: './student-exam-card.component.html',
  styleUrls: ['./student-exam-card.component.css']
})
export class StudentExamCardComponent implements OnInit {

  userDetails = new User();
  tempID : string = "";
  selectedExam = new Exam();
  listOfExams: Exam[] = [];
  month: string = "";
  tempExamDate: string = "";
  tempRemainingTime: number = 0;
  currentExamCode: string = '';

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
  //examCode : string = "";

  model ={
    examCode: '',
    userID: '',
    examName: ''
  }

  examStartModel ={
    examCode: '',
    showModal: false,
  }
  constructor(private examService: StudentExamService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        //console.log(this.userDetails);
        //console.log(this.userDetails._id);
        this.tempID = this.userDetails._id;
        this.model.userID = this.userDetails._id;
      },
      (err:any) => {}
    );

    //this.refreshExamList();

    setTimeout(()=>{
      this.examService.retrieveExam(this.tempID).subscribe( (res:any) =>{
        console.log('get: ' + this.tempID);
        this.examService.exams = res as Exam[];
        console.log(this.examService.exams);
        this.listOfExams = this.examService.exams;
        this.calculateRemainingTimeAndInitiate();
      });
    },500);
  }

  calculateRemainingTimeAndInitiate(){
    this.listOfExams.forEach( (exam) => {
      this.tempExamDate = exam.examDate + 'T' + exam.startTime + ":00";
      this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();
      //console.log( new Date('2022-04-21T01:30:00').getTime() - new Date().getTime() );
      //console.log( new Date('2022-04-21T03:12:00').getTime() - new Date().getTime() );
      if(this.tempRemainingTime>0){
        setTimeout( () => {
          exam.hasStarted = true;
          this.examStartModel.examCode = exam._id;
          this.examStartModel.showModal = true;

        }, this.tempRemainingTime)
      }
    } )
  }

  onLeaveClick(givenExam: Exam){
    console.log(givenExam._id);
    this.currentExamCode = givenExam._id;
    this.model.examCode = givenExam._id;
    this.model.examName = givenExam.examName;
  }

  examGoingOn(givenExam: Exam){
    this.tempExamDate = givenExam.examDate + 'T' + givenExam.startTime + ":00";
    this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();
    if(this.tempRemainingTime>0) return false;
    return this.tempRemainingTime + givenExam.duration*60*1000 > 0;
  }

  join(){
    console.log(this.model);
    this.examService.joinExam(this.model, this.model.examCode).subscribe(
      (res:any) =>{
        console.log('successful');
        this.refreshExamList();
      },
      (err:any) => {
        console.log('Error in updating exam: '+ JSON.stringify(err, undefined, 2));
      }
    );

  }

  refreshExamList(){
    this.examService.retrieveExam(this.tempID).subscribe( (res:any) =>{
      //M.toast("refreshed");
      console.log('refresh exam list: ' + this.tempID);
      this.examService.exams = res as Exam[];
      this.listOfExams = this.examService.exams;
      this.calculateRemainingTimeAndInitiate();
      console.log(this.examService.exams);
    });
  }

  leaveExam(){
    console.log(this.model);
    this.examService.leaveExam(this.model, this.model.examCode).subscribe(
      (res:any) =>{
        console.log('successful');
      },
      (err:any) => {
        console.log('Error in updating exam: '+ JSON.stringify(err, undefined, 2));
      }
    );
    this.refreshExamList();
  }

  getExamDate(input: string): string{
    return input.substring(8,10);
  }

  getExamMonth(input: string): any{
    this.month = input.substring(5,7);
    console.log('month: '+ this.month);
    return this.months.get(parseInt(this.month));
   // return this.month;
  }

  examStart(){
    this.router.navigateByUrl('student/exam/');
  }

}
