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
        this.sendNotification()
      }
  }

  @HostListener('window:blur', ['$event'])
    onBlur(event:any) {
      if (this.calibrationDone) {
        this.msg = 'User has left the screen';
        this.url = '';
        this.sendNotification();
        this.playAudio('changeScreen.m4a');
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
  examEnded: Boolean = false;

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
          socket.emit('examID', this.examDetails._id)
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
      if (displaySurface == 'monitor') {
        this.entireScreenPermissionStatus = true;
        this.stepFive();
      }else {
        this.entireScreenPermissionStatus = false;
        this.toastr.warning('Selection of entire screen mandatory!');
        this.stepFour();
      }
      const chunks: any[] | undefined = [];
    this.recorder.ondataavailable = (e: { data: any; }) =>{   chunks.push(e.data) }
    this.recorder.onstop = (e: any) => {
      completeBlob = new Blob(chunks, { type: chunks[0].type });
      this.sendBlob();
      try{
        this.recordVideo.nativeElement.src = URL.createObjectURL(completeBlob)
      }catch(e){
        console.log(e);
      }
    };

    this.recorder.start();
    }).catch( (err:any) => {
      console.log(err)
    });
  }



  recordStart() {
    this.hasVideo = false;
    this.isRecording = true;
    this.startRecording();
  }

  sendScreenBlob(){
    this.notification.cameraRecord = "";
    this.notification.screenRecord = '';
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = 'Exam ends. Here is the screen record of the examinee';
    this.studentService.notify(this.notification, this.id, new Blob()).subscribe(
      res => {
        socket.emit('notification', this.notification);
      },
      err => {}
    );
  }

  recordStop() {
    this.hasVideo = true;
    this.isRecording = false;
    if (this.recorder) {
      this.recorder.stop();
      this.toastr.success('record stopped')
      this.stream.getVideoTracks()[0].stop();
    }
  }

  sendBlob(){
    this.notification.cameraRecord = "";
    this.notification.screenRecord = "abcc";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = "User tried to change or resize the tab";
    this.studentService.notify(this.notification, this.id, completeBlob).subscribe(
      res => { console.log('done')},
      err => {}
    );

  }

  sendNotification(){
    this.notification.cameraRecord = "";
    this.notification.screenRecord = "";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = this.msg;
    this.studentService.notify(this.notification, this.id, new Blob()).subscribe(
      res => { console.log('done')},
      err => {}
    );
  }

  clockDown(date:Date) {
    this.tempExamDate = this.examDetails.examDate + 'T' + this.examDetails.startTime + ":00";
    this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();
    this.tempRemainingTime += this.examDetails.duration * 1000 * 60;

    if (this.tempRemainingTime < 5 * 60 * 1000 && this.tempRemainingTime >= 0) {
      this.hide = !this.hide;
    }

    if(this.tempRemainingTime < 0 && !this.examEnded){
      this.examEnded = true;
      this.endExam();
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

      this.remMinute %= 60;
      this.remSecond %= 60;
      this.remHour = this.remHour < 10 ? '0' + this.remHour : this.remHour;
      this.remMinute = this.remMinute < 10 ? '0' + this.remMinute : this.remMinute;
      this.remSecond = this.remSecond < 10 ? '0' + this.remSecond : this.remSecond;
    }
  }

  clickCount:number[] = [0,0,0,0,0,0,0,0,0];
  clickDoneCount:number = 0;

  calibrationClick(id:number) {
    this.clickCount[id]++;

    const idDom = "pt" + (id + 1).toString();
    let btn = document.getElementById(idDom);
    if (btn) {
      btn.style["opacity"] = ((this.clickCount[id] + 1) * 0.2).toString();
    }

    if (this.clickCount[id] == 5 && btn) {
      this.clickDoneCount++;
      btn.style.backgroundColor = "green";
    }

    if (this.clickDoneCount == 9) {
      this.calibrationDone = true;
      this.stepDone = 6;
      yesCanNotifity();
      this.toastr.success('Exam started');
      socket.emit('join', this.userDetails);

      this.url = '';
      this.sendNotification();

      setInterval(()=>{
        const date = new Date();
        this.clockDown(date);

      },500);
    }
  }

  endExam(){
    this.toastr.success('Exam ended');
    this.recordStop();
    this.router.navigateByUrl('dashboard');
  }

  isExamineeEnrolled() {
    this.userID = this.userDetails._id;
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
    var that = this;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
      .then(function(s){
        that.stepDone = 5;
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
