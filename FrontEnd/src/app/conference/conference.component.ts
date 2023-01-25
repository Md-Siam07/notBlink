import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import Utils from '../utils/utils';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  public createRoom(): void {
    const roomId = this.activatedRoute.snapshot.params['id'];
    //this.router.navigateByUrl(`/exam/${roomId}`)
    this.openInNewTab(`/call/${roomId}`)
  }

  openInNewTab(url: string) {
    let newRelativeUrl = this.router.createUrlTree([url]);
    let baseUrl = window.location.href.replace(this.router.url, '');

    window.open(baseUrl + newRelativeUrl, '_blank');
}

}
