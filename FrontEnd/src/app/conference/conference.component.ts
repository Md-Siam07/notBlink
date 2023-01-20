import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import Utils from '../utils/utils';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public createRoom(): void {
    const roomId = Utils.genRoomId();
    this.router.navigateByUrl(`/call/${roomId}`)
  }

}
