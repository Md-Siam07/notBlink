import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userServce: UserService, private http: HttpClient) { }

  model ={
    email: '',
    password: ''

  }
  serverErrorMessages: string = '';

  ngOnInit(): void {
  }

  noAccount(){
    this.router.navigate(['signup']);
  }

  signIn(){
    this.userServce.login(this.model).subscribe(
      (res:any) => {
        if(res['token']){
          console.log(res['token'])
          localStorage.setItem('token', res['token']);
          this.userServce.loginStatus = true;
          this.router.navigateByUrl('dashboard');
        }
        console.log(res);
        //this.userServce.setToken(res['token']);
        //localStorage.setItem('token', res.token);
      },
      err => {
        this.serverErrorMessages = err.error.message;

      }
    );
  }

  // signIn() {
  //   this.http.post(environment.apiBaseUrl + '/authenticate', this.model)
  //     .subscribe(
  //       (res:any) => {
  //         console.log(res);
  //         if (res['token']) {
  //           console.log(res['token']);
  //           localStorage.setItem('token', res['token']);
  //         }
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );    
  // }
}
