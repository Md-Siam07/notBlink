import { CommaExpr } from '@angular/compiler';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from 'src/app/shared/exam.service';
import { MyNotification } from 'src/app/shared/notification.model';
import { StudentExamService } from 'src/app/shared/student-exam.service';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/shared/user.service';
const mediaDevices = navigator.mediaDevices as any;
let completeBlob: Blob;

declare var MediaRecorder: any;
@Component({
  selector: 'app-screen-record',
  templateUrl: './screen-record.component.html',
  styleUrls: ['./screen-record.component.css']
})
export class ScreenRecordComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService: UserService, private examService: ExamService, private studentService: StudentExamService) { }

  id: string = '';
  userDetails = new User();
  hasVideo: boolean = false;
  isRecording: boolean = false;
  recorder: any;
  stream: any;
  notification = new MyNotification();

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log('id id: ',this.id);
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
       },
      (err:any) => {}
    );
    this.recordStart();

    //setTimeout(this.recordStop, 20000);
  }

  @ViewChild('recordVideo')
  recordVideo!: ElementRef;

  async startRecording() {
    this.stream = await mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" }
    });
    this.recorder = new MediaRecorder(this.stream);


    const chunks: any[] | undefined = [];
    this.recorder.ondataavailable = (e: { data: any; }) =>{   chunks.push(e.data) }
    this.recorder.onstop = (e: any) => {
      completeBlob = new Blob(chunks, { type: chunks[0].type });
      //completeBlob = completeBlob.slice(completeBlob.size-1200000, completeBlob.size);
      //completeBlob = completeBlob.slice(1200000, 2400000);
      console.log(completeBlob.size);
      this.recordVideo.nativeElement.src = URL.createObjectURL(completeBlob);
    };


    this.recorder.start();
  }


  recordStart() {
    this.hasVideo = false;
    this.isRecording = true;
    this.startRecording();
  }


  recordStop() {
    console.log('stopped')
    this.hasVideo = true;
    this.isRecording = false;
    this.recorder.stop();
    this.stream.getVideoTracks()[0].stop();
    this.sendBlob();
    //console.log(this.stream);
  }

  sendBlob(){
    this.examService.setBlob(completeBlob);
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

  downloadBlob(name = 'video.mp4'): any {
    if (
      window.navigator &&
      (window.navigator as any).msSaveOrOpenBlob
    ) return (window.navigator as any).msSaveOrOpenBlob(completeBlob);


    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(completeBlob);
    console.log(data)

    const link = document.createElement('a');
    link.href = data;
    link.download = name;


    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );


    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }
 

}
