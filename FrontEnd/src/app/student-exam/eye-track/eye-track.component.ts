import { Component, OnInit } from '@angular/core';

declare function startTrack(): any;
declare function hello():any;

@Component({
  selector: 'app-eye-track',
  templateUrl: './eye-track.component.html',
  styleUrls: ['./eye-track.component.css']
})
export class EyeTrackComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    startTrack();
    //hello();
  }

}
