import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}
  arr = new Array();
  name = '';
  listArr = new Array();

  ngOnInit(): void {
    const marshall = JSON.stringify({
      id: this.userService.examNum,
      email: this.userService.email,
      type: this.userService.type,
    });
    console.log('MARSHALL', marshall);

    fetch(environment.apiBaseUrl + '/viewData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: marshall,
    })
      .then((res: any) => {
        console.log('RESPONSE', res);

        for (let i in res) {
          let dt = new Date(res[i].time);
          console.log(dt);
          let tm = dt;
          this.listArr.push({
            message: res[i].message,
            time: tm,
          });
        }
      })
      .catch((err) => {
        console.log('ERROR');
      });

    // (res: any) => {
    //   console.log(res);
    //   for (let i in res) {
    //     let dt = new Date(res[i].time);
    //     console.log(dt);
    //     let tm = dt;
    //     this.listArr.push({
    //       message: res[i].message,
    //       time: tm,
    //     });
    //   }
    // },
    //
    // (err) => {}
    this.arr = this.userService.getArr();
    this.name = this.userService.name;
    console.log(this.arr);
    console.log(this.name);
  }
  goback() {
    this.router.navigateByUrl('table');
  }
}
