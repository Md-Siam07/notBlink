import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
const mediaDevices = navigator.mediaDevices as any;
let completeBlob: Blob;

declare var MediaRecorder: any;
@Component({
  selector: 'app-screen-record',
  templateUrl: './screen-record.component.html',
  styleUrls: ['./screen-record.component.css']
})
export class ScreenRecordComponent implements OnInit {

  hasVideo: boolean = false;
  isRecording: boolean = false;
  recorder: any;
  stream: any;


  @ViewChild('recordVideo')
  recordVideo!: ElementRef;

  async startRecording() {
    this.stream = await mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" }
    });
    this.recorder = new MediaRecorder(this.stream);


    const chunks: any[] | undefined = [];
    this.recorder.ondataavailable = (e: { data: any; }) => chunks.push(e.data);
    this.recorder.onstop = (e: any) => {
      completeBlob = new Blob(chunks, { type: chunks[0].type });
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
    this.hasVideo = true;
    this.isRecording = false;
    this.recorder.stop();
    this.stream.getVideoTracks()[0].stop();
    console.log(this.stream);
  }

  sendBlob(){
    if (
      window.navigator &&
      (window.navigator as any).msSaveOrOpenBlob
    ) return (window.navigator as any).msSaveOrOpenBlob(completeBlob);
    //send the blob from here
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
  constructor() { }

  ngOnInit(): void {
  }

}
