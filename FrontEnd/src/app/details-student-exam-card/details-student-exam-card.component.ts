import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { StudentExamService } from '../shared/student-exam.service';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { MyNotification } from '../shared/notification.model';



@Component({
  selector: 'app-details-student-exam-card',
  templateUrl: './details-student-exam-card.component.html',
  styleUrls: ['./details-student-exam-card.component.css']
})
export class DetailsStudentExamCardComponent implements OnInit {

  month: string = "";
  participants: User[] = [];
  tempUser = new User();
  participantSet = new Set<string>();
  currentExamCode: string = '';
  currentExam = new Exam();
  tempExamDate: string = "";
  tempRemainingTime: number = 0;

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

  id: string = '';
  tempID: string = '';
  model ={
    examCode: '',
    userID: '',
    examName: ''
  }

  constructor(private userService: UserService,  private studentExamService: StudentExamService, private route: ActivatedRoute, private router: Router, private examService: ExamService) { }
  examDetails = new Exam();
  userDetails = new User();

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    //console.log(this.id);
    this.studentExamService.getSingleExamDetails(this.id).subscribe(
      (res:any) => {
        this.examDetails = res as Exam;
        this.refreshParticipantList();
      },
      err => {}
    );
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        //console.log(this.userDetails);
        //console.log(this.userDetails._id);
        this.tempID = this.userDetails._id;
        this.model.userID = this.userDetails._id;
        });
      
    

    //this.examDetails = this.studentExamService.selectedExam;
    //console.log(this.examDetails);
  }

  examGoingOn(givenExam: Exam){
    this.tempExamDate = givenExam.examDate + 'T' + givenExam.startTime + ":00";
    this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();
    if(this.tempRemainingTime>0) return false;
    return this.tempRemainingTime + givenExam.duration*60*1000 > 0;
  }

  onLeaveClick(givenExam: Exam){
    console.log(givenExam._id);
    this.currentExamCode = givenExam._id;
    this.model.examCode = givenExam._id;
    this.model.examName = givenExam.examName;
    this.currentExam = givenExam;
  }

  leaveExam(){
    console.log(this.model);
    this.studentExamService.leaveExam(this.model, this.model.examCode).subscribe(
      (res:any) =>{
        console.log('successful');
        this.router.navigateByUrl('dashboard');
      },
      (err:any) => {
        console.log('Error in updating exam: '+ JSON.stringify(err, undefined, 2));
      }
    );

    //this.refreshExamList();
  }

  getExamDate(input: string): string{
    return input.substring(8,10);
  }

  getExamMonth(input: string): any{
    this.month = input.substring(5,7);
    //console.log('month: '+ this.month);
    return this.months.get(parseInt(this.month));
  }

  refreshParticipantList(){
    this.participantSet = new Set<string>();
    this.participants = [];
    //this.examDetails = this.examService.selectedExam;
    this.examDetails.participants.forEach(participantID => {
      this.participantSet.add(participantID);
    });
    console.log('participant set: ', this.examDetails.participants);
    this.participantSet.forEach(participantID => {
      this.examService.getParticipant(participantID).subscribe(
        (res:any) => {
          this.tempUser = res as User;
          this.participants.push(JSON.parse(JSON.stringify(this.tempUser)));
        },
        (err:any) => {}
      );
    });
  }

  examStart(currentExam: Exam){
    this.examService.selectedExam = currentExam;
    this.router.navigateByUrl('student/exam/'+currentExam._id);
  }

}
