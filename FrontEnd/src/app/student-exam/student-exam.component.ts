import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { io } from 'socket.io-client';
import { Exam } from '../shared/exam.model';
import { MyNotification } from '../shared/notification.model';
import { StudentExamService } from '../shared/student-exam.service';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';

declare function isScreenWidthHeightOK():any;
declare function yesCanNotifity():any;

const mediaDevices = navigator.mediaDevices as any;
let completeBlob: Blob;
const socket = io('http://localhost:3000');

@Component({
  selector: 'app-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.css']
})
export class StudentExamComponent implements OnInit {
  doneAllCondition = false;
  calibrationDone:Boolean = false;
  stepDone = 0;
  entireScreenPermissionStatus = false;


  constructor(private examService: StudentExamService, private route: ActivatedRoute, private router: Router, private userService:UserService, private toastr: ToastrService, private studentService: StudentExamService ) { }

  // screen record and window monitor
  @HostListener('window:focus', ['$event'])
    onFocus(event:any) {
      if (this.calibrationDone) {
        this.msg = 'User is back on screen';
        this.url = '';
        //this.recordStop();
        this.sendNotification()
        //todo (notify that the student is back)
      }
  }

  @HostListener('window:blur', ['$event'])
    onBlur(event:any) {
      if (this.calibrationDone) {
        this.msg = 'User has left the screen';
        this.url = '';
        //this.recordStop();
        this.sendNotification();
        this.playAudio('changeScreen.m4a');
        //alert("You can not chnage the screen during the exam!\nOnly the tab of !Blink is accepted!");
        //this.notify();
        //alert("user leave korso ken?")
      }
  }

  playAudio(filename: string){
    let audio = new Audio();
    audio.src = "../../../assets/audio/" + filename;
    audio.load();
    audio.play();
  }

  scrHeight:any;
  scrWidth:any;

  @HostListener('window:resize', ['$event'])
    getScreenSize(event:any) {
      if(!isScreenWidthHeightOK() && this.calibrationDone){
        this.msg = "Exam tab not full screened"
        this.url = '';
        //this.recordStop();
        this.sendNotification();
      }

  }

  hasVideo: boolean = false;
  isRecording: boolean = false;
  recorder: any;
  stream: any;
  url!: string;
  msg!: string;
  notification = new MyNotification();

  examDetails = new Exam();
  userDetails = new User();
  tempRemainingTime : number = 0;
  id: string = '';
  userID: string = '';
  tempExamDate: string = '';

  remDay: any;
  remHour: any;
  remMinute: any;
  remSecond: any;
  hide: Boolean = false;

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.examService.getSingleExamDetails(this.id).subscribe(
      (res:any) =>{
        this.examDetails = res as Exam;
        if (res == null) {
          this.toastr.error("Exam don't exist!")
          this.router.navigateByUrl('dashboard')
        }
        else {
          this.userService.getUserProfile().subscribe(
          (res:any) =>{
            this.userDetails = res['user'];
            this.stepOne();
          })
        }
      }
    );

  }

  @ViewChild('recordVideo')
  recordVideo!: ElementRef;

  async startRecording() {
    await mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" }
    }).then((strm:any)=>{
      this.stream = strm;
      this.recorder = new MediaRecorder(strm);
      let displaySurface = strm.getVideoTracks()[0].getSettings().displaySurface;
      console.log(displaySurface);
      if (displaySurface == 'monitor') {
        //to do
        this.entireScreenPermissionStatus = true;
        console.log("entire screen!");
        this.stepFive();

      }else {
        this.entireScreenPermissionStatus = false;
        this.toastr.warning('Selection of entire screen mandatory!');
        this.stepFour();
        //console.log('Selection of entire screen mandatory!');
      }
      const chunks: any[] | undefined = [];
    this.recorder.ondataavailable = (e: { data: any; }) =>{   chunks.push(e.data) }
    this.recorder.onstop = (e: any) => {
      completeBlob = new Blob(chunks, { type: chunks[0].type });
      this.sendScreenBlob();
      console.log(completeBlob.size);
      try{
        this.recordVideo.nativeElement.src = URL.createObjectURL(completeBlob)
      }catch(e){
        //to do
        console.log(e);
      }
    };




    this.recorder.start();
    }).catch( (err:any) => {
      //to dos
      console.log(err)
    });





  }



  recordStart() {
    console.log('started')
    this.hasVideo = false;
    this.isRecording = true;
    this.startRecording();
  }

  sendScreenBlob(){
    console.log('called')
    //this.examService.setBlob(completeBlob);
    this.notification.cameraRecord = "";
    this.notification.screenRecord = this.url;
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = this.msg;
    this.toastr.error(this.msg);
    console.log(this.notification);
    this.studentService.notify(this.notification, this.id, new Blob()).subscribe(
      res => {
        socket.emit('notification', this.notification);
        //this.startRecording()
      },
      err => {}
    );
  }

  recordStop() {
    console.log('stopped')
    this.hasVideo = true;
    this.isRecording = false;
    console.log("state: ", this.recorder);
    if (this.recorder) {
      this.recorder.stop();
      this.stream.getVideoTracks()[0].stop();
    }


    //console.log(this.stream);
  }

  sendBlob(){
    console.log('called')
    //this.examService.setBlob(completeBlob);
    this.notification.cameraRecord = "";
    this.notification.screenRecord = "abcc";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = "User tried to change or resize the tab";
    console.log(this.notification);
    this.studentService.notify(this.notification, this.id, completeBlob).subscribe(
      res => { console.log('done')},
      err => {}
    );

  }

  sendNotification(){
    console.log('called')
    //this.examService.setBlob(completeBlob);
    this.notification.cameraRecord = "";
    this.notification.screenRecord = "";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = this.msg;
    console.log(this.notification);
    this.studentService.notify(this.notification, this.id, new Blob()).subscribe(
      res => { console.log('done')},
      err => {}
    );

  }

  clockDown(date:Date) {
    this.tempExamDate = this.examDetails.examDate + 'T' + this.examDetails.startTime + ":00";
    this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();
    this.tempRemainingTime += this.examDetails.duration * 1000;

    if (this.tempRemainingTime < 5 * 60 * 1000 && this.tempRemainingTime >= 0) {
      this.hide = !this.hide;
    }

    if (this.tempRemainingTime < 0) {
      this.hide = false;
      this.remDay = "00";
      this.remHour = "00";
      this.remMinute = "00";
      this.remSecond = "00";
    }
    else {
      this.remSecond = Math.floor(this.tempRemainingTime / 1000);
      this.remMinute = Math.floor(this.remSecond / 60);
      this.remHour = Math.floor(this.remMinute / 60);
      //this.remDay = Math.floor(this.remHour / 24);

      //this.remHour %= 24;
      this.remMinute %= 60;
      this.remSecond %= 60;
      this.remHour = this.remHour < 10 ? '0' + this.remHour : this.remHour;
      this.remMinute = this.remMinute < 10 ? '0' + this.remMinute : this.remMinute;
      this.remSecond = this.remSecond < 10 ? '0' + this.remSecond : this.remSecond;
    }

    //console.log(this.rhour+":"+this.rmins+":"+this.rsec);


  }

  clickCount:number[] = [0,0,0,0,0,0,0,0,0];
  clickDoneCount:number = 0;

  calibrationClick(id:number) {
    this.clickCount[id]++;

    const idDom = "pt" + (id + 1).toString();
    let btn = document.getElementById(idDom);
    if (btn) {
      console.log(((this.clickCount[id] + 1) * 0.2).toString());
      btn.style["opacity"] = ((this.clickCount[id] + 1) * 0.2).toString();
    }

    if (this.clickCount[id] == 5 && btn) {
      this.clickDoneCount++;
      //hide it
      btn.style.backgroundColor = "green";
    }

    if (this.clickDoneCount == 9) {
      //alert("Calibration Done");
      this.calibrationDone = true;
      this.stepDone = 6;
      yesCanNotifity();
      this.msg = 'Exam started';
      this.toastr.success(this.msg);
      this.url = '';
      //this.recordStop();
      this.sendNotification();

      setInterval(()=>{
        const date = new Date();
        this.clockDown(date);

      },500);
      // notify teacher -> student joined
    }
  }

  isEntireScreenSharePermissionOK() {

  }

  isExamineeEnrolled() {
    this.userID = this.userDetails._id;
     console.log(this.examDetails.participants)
     console.log(this.userID)
     console.log("ddd - ", this.examDetails.participants.includes(this.userID))
    return this.examDetails.participants.includes(this.userID)
  }

  helperFunction() {
    this.toastr.error("Camera permmision is required!");
    this.router.navigateByUrl('dashboard');
  }

  isExamStart(): Boolean{
    this.tempExamDate = this.examDetails.examDate + 'T' + this.examDetails.startTime + ":00";
    this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();
    return this.tempRemainingTime < 0;
  }

  isExamFinish(): Boolean {
    this.tempExamDate = this.examDetails.examDate + 'T' + this.examDetails.startTime + ":00";
    this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();
    return this.tempRemainingTime + this.examDetails.duration*60*1000 <= 0;
  }

  examGoingOn(): Boolean {
    if(!this.isExamStart()) return false;
    return !this.isExamFinish();
  }

  stepOne() {  // isEnrolled
    if (this.isExamineeEnrolled()) {
      this.stepDone = 1;
      this.stepTwo();
    }
    else {
      this.toastr.error("You are not enrolled for this exam!");
      this.router.navigateByUrl('dashboard');
    }
  }

  stepTwo() {  // Time
    if (this.examGoingOn()) {
      this.stepDone = 2;
      this.stepThree();
    }
    else {
      if (!this.isExamStart()){
        this.toastr.error("Exam not started yet!");
      }
      else if (this.isExamFinish()){
        this.toastr.error("Exam already finished!");
      }
      else {
        this.toastr.error("Something Wrong! Please inform developer.");
      }
      this.router.navigateByUrl('dashboard');
    }
  }

  stepFive() { // Camera permission
    //isCameraPermissionOK()
    var that = this;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
      .then(function(s){
        console.log("Get camera permission");
        that.stepDone = 5;
        //that.stepFive();
      })
      .catch(function(err){
        that.helperFunction();
      });
    }
  }

  stepThree() {  // Full screen mood checking
    if (isScreenWidthHeightOK()) {
      this.stepDone = 3;
      this.stepFour();
    }
    else {
      this.toastr.error("Exam Tab Should maximize!");
      this.router.navigateByUrl('dashboard');
    }
  }

  stepFour() {  // Entire Screen share permission
    this.recordStart();
  }
}
