import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyNotification } from 'src/app/shared/notification.model';
import { StudentExamService } from 'src/app/shared/student-exam.service';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/shared/user.service';
import io from 'socket.io-client';
import { Exam } from 'src/app/shared/exam.model';

declare function startTrack(): any;
declare function suspectedStatus(): any;
const socket = io('http://localhost:3000');

@Component({
  selector: 'app-eye-track',
  templateUrl: './eye-track.component.html',
  styleUrls: ['./eye-track.component.css']
})
export class EyeTrackComponent implements OnInit {

  id: string = '';
  constructor(private route: ActivatedRoute, private userService: UserService, private examService: StudentExamService) { }
  notification= new MyNotification();
  userDetails = new User();
  exam = new Exam();

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.examService.getSingleExamDetails(this.id).subscribe(
      (res: any) => {
        this.exam = res as Exam;
      },
      (err)=>{
        console.log(err);
      }
    )
    startTrack();
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
       },
      (err:any) => {}
    );
  }

  intervalID: any = setInterval(() => {
    if (suspectedStatus() != 0 ) {
      this.playAudio('suspected.m4a');
      this.notify();
    }
  }, this.exam.outSightTime*1000);

  notify(){
    //console.log("notifying");
    this.notification.cameraRecord = "";
    this.notification.screenRecord = "";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = "User has outsighted the screen longer than the limit";
    this.examService.notify(this.notification, this.id).subscribe(
      res =>{
        socket.emit('notification', this.notification);
        //this.notifications.push(this.notification);
      },
      err => {
        console.log('erroor');
      }
    )
  }

  playAudio(filename: string){
    let audio = new Audio();
    audio.src = "../../../assets/audio/" + filename;
    audio.load();
    audio.play();
  }

}




//https://bobbyhadz.com/blog/typescript-call-function-every-n-seconds#:~:text=Use%20the%20setInterval()%20method,is%20the%20delay%20in%20milliseconds.&text=Copied!
