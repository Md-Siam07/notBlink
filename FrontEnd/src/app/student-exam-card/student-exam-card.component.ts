import { Component, OnInit } from '@angular/core';
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
    userID: ''
  }
  constructor(public examService: StudentExamService, private userService: UserService) { }
  
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
   // this.listOfExams
  }

  onLeaveClick(examID: string){
    console.log(examID);
    this.model.examCode = examID;
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
    return input.substring(0,2);
  }

  getExamMonth(input: string): any{
    this.month = input.substring(3,5);
    return this.months.get(parseInt(this.month));
   // return this.month;
  }

}
