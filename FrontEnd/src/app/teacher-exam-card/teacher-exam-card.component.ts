import { Component, OnInit } from '@angular/core';
import { ExamService } from '../shared/exam.service';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { Exam } from '../shared/exam.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-exam-card',
  templateUrl: './teacher-exam-card.component.html',
  styleUrls: ['./teacher-exam-card.component.css']
})
export class TeacherExamCardComponent implements OnInit {

  constructor(private examService: ExamService, private userService: UserService, private router: Router) { }
  userDetails = new User();
  exams: Exam[] = [];
  tempID : string = "";
  recipientEmail : string = "";
  selectedExam = new Exam();

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

  model = {
    examCode: '',
    recipiennt: ''
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        console.log(this.userDetails);
        console.log(this.userDetails._id);
        this.tempID = this.userDetails._id;
      },
      (err:any) => {}
    );

    setTimeout(()=>{
      this.examService.getExamList(this.tempID).subscribe( (res:any) =>{
        console.log('get: ' + this.tempID);
        this.examService.exams = res as Exam[];
        this.exams = this.examService.exams;
        console.log(this.examService.exams);
      });
    },500);
  }

  onClick(exam: Exam){
    this.selectedExam = JSON.parse(JSON.stringify(exam));
  }

  update(){
    this.examService.update(this.selectedExam).subscribe(
      (res:any) =>{
        console.log('successful');
        this.refreshExamList();
        this.resetForm();
      },
      err => {
        console.log('Error in updating exam: '+ JSON.stringify(err, undefined, 2));
      }
    )
  }

  refreshExamList(){
    this.examService.getExamList(this.tempID).subscribe( (res:any) =>{
      //console.log('get: ' + this.tempID);
      this.examService.exams = res as Exam[];
      this.exams = this.examService.exams;
      //console.log(this.examService.exams);
    });
  }

  delete(){
    this.examService.deleteExam(this.selectedExam).subscribe( (res:any) =>{
      console.log('deleted');
      this.refreshExamList();
    },
    (err)=>{
      console.log('error in deleting: ' + JSON.stringify(err, undefined, 2));
    } )

  }


  createExam(){
    this.selectedExam.teacherID = this.userDetails._id;
    this.selectedExam.teacherName = this.userDetails.fullName;
    console.log(this.selectedExam)
    //console.log(this.userDetails);
    this.examService.postExam(this.selectedExam).subscribe(
      (res:any) => {
        //console.log(this.selectedExam);
        console.log('successfull');
        //this.successToast();
        this.resetForm();
        this.refreshExamList();
        //this.router.navigateByUrl('dashboard');

      },
      (err:any) => {

      }
    )
  }

  invite(){
    this.model.examCode = this.selectedExam._id;
    this.model.recipiennt = this.recipientEmail;
    console.log(this.model);
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

  resetForm(){
    this.selectedExam.duration = 0;
    this.selectedExam.examName = "";
    this.selectedExam.examDate = "";
    this.selectedExam.startTime = "";
  }

  getExamDate(input: string): string{
    return input.substring(8,10);
  }

  getExamMonth(input: string): any{
    this.month = input.substring(5,7);
    console.log('month: '+ this.month);
    return this.months.get(parseInt(this.month));
  }

  viewMoreRouting() {
    this.router.navigateByUrl('teacher/examdetails');
  }


}
