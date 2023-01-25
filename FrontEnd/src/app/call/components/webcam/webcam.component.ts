import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';

@Component({
  selector: 'app-webcam',
  template: `
    <webcam
      [height]="0"
      [width]="0"
      [trigger]="triggerObservable"
      (imageCapture)="handleImage($event)"
      [imageQuality]="1"
      (initError)="handleInitError($event)"
    ></webcam>
  `,
  styles: [],
})
export class WebcamComponent implements OnInit {
  // toggle webcam on/off
  public showWebcam = false;
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage | null = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  public ngOnInit(): void {}

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  // public toggleWebcam(): void {
  //   this.showWebcam = !this.showWebcam;
  // }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}
