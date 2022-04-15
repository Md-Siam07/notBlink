import { Component, OnInit } from '@angular/core';
import { ExamService } from '../shared/exam.service';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { Exam } from '../shared/exam.model';

@Component({
  selector: 'app-teacher-exam-card',
  templateUrl: './teacher-exam-card.component.html',
  styleUrls: ['./teacher-exam-card.component.css']
})
export class TeacherExamCardComponent implements OnInit {

  constructor(public examService: ExamService, private userService: UserService) { }
  userDetails = new User();
  tempID : string = "";
  recipientEmail : string = "";
  selectedExam = new Exam();

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
      //console.log(this.examService.exams);
    });
  }

  delete(){
    this.examService.deleteExam(this.selectedExam).subscribe( (res:any) =>{
      console.log('deleted');
    },
    (err)=>{
      console.log('error in deleting: ' + JSON.stringify(err, undefined, 2));
    } )
    this.refreshExamList();
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

  

}
