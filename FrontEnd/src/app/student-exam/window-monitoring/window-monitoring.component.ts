import { HostListener, Component, OnInit } from '@angular/core';
import { MyNotification } from 'src/app/shared/notification.model';
import { StudentExamService } from 'src/app/shared/student-exam.service';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/shared/user.service';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

@Component({
  selector: 'app-window-monitoring',
  templateUrl: './window-monitoring.component.html',
  styleUrls: ['./window-monitoring.component.css']
})
export class WindowMonitoringComponent implements OnInit {

  notification= new MyNotification();
  //notifications!: MyNotification[];
  userDetails = new User();

  constructor(private userService: UserService, private examService: StudentExamService) { }
  
  @HostListener('window:focus', ['$event'])
    onFocus(event:any) {
    console.log("****user attempted leaving but changed its mind, do actions here");
    //alert("****user trying to leave, user tumi valo hoye jao");
    
  } 
  
  @HostListener('window:blur', ['$event'])
    onBlur(event:any) {
    this.playAudio();
    alert("****user left, user tumi valo hoye jao");
    this.notify();
    //alert("user leave korso ken?")
  } 
  
  scrHeight:any;
  scrWidth:any;

  @HostListener('window:resize', ['$event'])
    getScreenSize(event:any) { 
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;
      console.log(this.scrHeight, this.scrWidth);
      this.notify();
  }
  playAudio(){
    let audio = new Audio();
    audio.src = "../../../assets/audio/FM9B3TC-alarm.mp3";
    audio.load();
    audio.play();
  }

  ngOnInit(): void {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
       },
      (err:any) => {}
    );

    // socket.on('notification', (res:any) =>{

    // })
  }
  
  notify(){
    console.log("notifying");
    this.notification.cameraRecord = "";
    this.notification.screenRecord = "";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = "User tried to change or resize the tab";
    this.examService.notify(this.notification, "6293ca6e8aab0923a4cdcb5b").subscribe(
      res =>{
        socket.emit('notification', this.notification);
        //this.notifications.push(this.notification);
      },
      err => {
        console.log('erroor');
      }
    )
  }

}
