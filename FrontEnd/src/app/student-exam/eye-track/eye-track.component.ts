import { Component, OnInit } from '@angular/core';

declare function startTrack(): any;
declare function suspectedStatus(): any;

@Component({
  selector: 'app-eye-track',
  templateUrl: './eye-track.component.html',
  styleUrls: ['./eye-track.component.css']
})
export class EyeTrackComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    startTrack();
  }

  intervalID: any = setInterval(() => {
    if (suspectedStatus() != 0 ) {
      console.log("YEEEEEE");
    }
  }, 3000);

}




//https://bobbyhadz.com/blog/typescript-call-function-every-n-seconds#:~:text=Use%20the%20setInterval()%20method,is%20the%20delay%20in%20milliseconds.&text=Copied!
