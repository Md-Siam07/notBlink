import { HostListener, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-window-monitoring',
  templateUrl: './window-monitoring.component.html',
  styleUrls: ['./window-monitoring.component.css']
})
export class WindowMonitoringComponent implements OnInit {

  @HostListener('window:focus', ['$event'])
    onFocus(event:any) {
    console.log("****user attempted leaving but changed its mind, do actions here");
    
  } 
  
  @HostListener('window:blur', ['$event'])
    onBlur(event:any) {
    this.playAudio();
    alert("****user left, user tumi valo hoye jao");
    //alert("user leave korso ken?")
  } 
  
  scrHeight:any;
  scrWidth:any;

  @HostListener('window:resize', ['$event'])
    getScreenSize(event:any) { 
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;
      console.log(this.scrHeight, this.scrWidth);
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
  }

}
