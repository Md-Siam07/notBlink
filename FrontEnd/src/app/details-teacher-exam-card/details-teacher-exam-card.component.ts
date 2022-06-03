import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { MyNotification } from '../shared/notification.model';
import { User } from '../shared/user.model';

import io from 'socket.io-client';
import { BehaviorSubject, observable, Observable, tap, timer } from 'rxjs';
import { UserService } from '../shared/user.service';

const socket = io('http://localhost:3000');

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

  

  examDetails = new Exam();
  userDetails = new User();
  participants: User[] = [];
  tempUser !:User;
  dummyData !: any;
  notifications: MyNotification[] = [];
  //notifications: Observable<MyNotification[]>
  copyNotifications: MyNotification[] = [];
  tempNotification = new MyNotification();
  participantSet = new Set<string>();
  observer: any;
  index: number = 0;
  id: string = '';
  notificationList = new BehaviorSubject<MyNotification[]>([]);

  constructor(private examService: ExamService, private route: ActivatedRoute, private router: Router, private userService: UserService) {
    timer(0,1000).pipe(tap(()=> this.loadNotification())).subscribe();
  }

  

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'] as User;
        console.log(this.userDetails.isTeacher)
        if(!this.userDetails.isTeacher){
          this.router.navigateByUrl('dashboard');
        }
      }
    )

    this.examService.getSingleExamDetails(this.id).subscribe(
      (res: any) => {this.examDetails = res as Exam},
      err => console.log(err)
    );
    // this.examService.getNotifications(this.id).subscribe(
    //   (res:any) => {
    //     this.notifications = res;
    //     const that = this;
    //     this.observer = Observable.create(function subscribe(subscriber:any) {
    //       subscriber.next(that.notifications);
    //     })
    //     //console.log(res);
    //     this.refreshParticipantList();
    //   },
    //   err => {}
    // );
    // socket.on('notification', (data:any) =>{
    //   console.log(data);
    //   //this.refreshNotifications(data);
    //   const that = this;
    //   this.observer = Observable.create(function subscribe(subscriber:any) {
    //     subscriber.next(that.refreshNotifications(data));
    //  })
    // })
    
     // this.observer = this.examService.getNotifications(this.id);
      
    //this.examDetails = this.examService.selectedExam;
    
    //console.log('here: ', this.examDetails.question);
  }

  loadNotification(){
    console.log('refresh called')
    this.examService.getNotifications(this.id).subscribe(
      (res:any) => {
        //this.notifications = res;
        this.notificationList.next(res);
        //console.log(res);
        //this.refreshParticipantList();
      },
      err => {}
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
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

  refreshNotifications(data:any){
    //this.notifications = [...this.notifications, data];
    return [...this.notifications, data];
    // this.notifications = new Array();
    
    // if(this.dummyData.screenRecord != '')
    //   alert('Examinee: ' + this.dummyData.fullName + ' is suspected to change the tab! \nPlease reload the page to refresh the stream and view the evidence');
    // else
    //   alert('Examinee: ' + this.dummyData.fullName + ' is suspected to view outside the screen!\nPlease reload the page to refresh the stream and view the evidence');
    
    // this.examService.getSingleExamDetails(this.id).subscribe(
    //   (res:any) => {
    //     this.examDetails = res as Exam;
    //     this.refreshParticipantList();
    //     //this.notifications = res['notification'];
    //     res['notification'].forEach( (notification: any) => {
    //       this.tempNotification = new MyNotification();
    //       this.tempNotification.fullName = notification.examinee.fullName;
    //       this.tempNotification.batch = notification.examinee.batch;
    //       this.tempNotification.institute = notification.examinee.institute;
    //       this.tempNotification.roll = notification.examinee.roll;
    //       this.tempNotification.phone_number = notification.examinee.phone_number;
    //       this.tempNotification.cameraRecord = notification.cameraRecord;
    //       this.tempNotification.screenRecord = notification.screenRecord;
    //       this.tempNotification.time = notification.time;
    //       this.tempNotification.message = notification.message;
    //       this.notifications =  [...this.notifications.concat(this.tempNotification)]
    //     }); 
        
    //   },
    //   err => {}
    // );
   
  }

  refreshParticipantList(){
    console.log('called')
    this.participantSet = new Set<string>();
    this.participants = [];
    //this.examDetails = this.examService.selectedExam;

    this.examService.getSingleExamDetails(this.id).subscribe(
      (res:any) => {
        this.examDetails = res as Exam;
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
    );

    // this.examDetails.participants.forEach(participantID => {
    //   this.participantSet.add(participantID);
    // });
    // console.log('participant set: ', this.examDetails.participants);
    // this.participantSet.forEach(participantID => {
    //   this.examService.getParticipant(participantID).subscribe(
    //     (res:any) => {
    //       this.tempUser = res as User;
    //       this.participants.push(JSON.parse(JSON.stringify(this.tempUser)));
    //     },
    //     (err:any) => {}
    //   );
    // });
  }

  onClick(exam: Exam){
    this.selectedExam = JSON.parse(JSON.stringify(exam));
  }

  update(){
    this.examService.update(this.selectedExam, this.file).subscribe(
      (res:any) =>{
        console.log(this.selectedExam);
        this.reloadComponent();
        //console.log('successful');
      },
      err => {
        console.log('Error in updating exam: '+ JSON.stringify(err, undefined, 2));
      }
    )
  }


  delete(){
    this.examService.deleteExam(this.selectedExam).subscribe( (res:any) =>{
      //console.log('deleted');
      this.router.navigateByUrl('/dashboard');
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
        this.examService.getSingleExamDetails(this.id).subscribe(
          (res:any) => {
            this.examDetails = res as Exam;
            this.refreshParticipantList();
          },
          err => {}
        );
      },
      (err:any) => {
        console.log('Error in updating exam: '+ JSON.stringify(err, undefined, 2));
      }
    );
    
  }

  reloadComponent() {
    let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

}
