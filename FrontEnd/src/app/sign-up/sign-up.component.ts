import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/user.model';

import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  
  isTeacher : boolean = false;
  selectedUser = new User();
  passwordMismatch : boolean = false;
  cPassword: string = "";

  response = {
    userId: '',
    email: ''
  }

  constructor(private userService: UserService, private router: Router) { }
  serverErrorMessages: string = "";

  ngOnInit(): void {
    if(localStorage.getItem('loginStatus') == 'true'){
      this.router.navigateByUrl('dashboard');
    }
  }
  userType() : boolean {
    return this.isTeacher;
  }

  setUserType( type : boolean ) {
    this.isTeacher = type;
    this.selectedUser.isTeacher = this.isTeacher;
  }

  signUp(){
    //console.log('sign up clicked');
    this.passwordMismatch = false;
    if(this.selectedUser.password!= this.cPassword){
        this.passwordMismatch = true;
        return;
    }
    
    this.userService.postUser(this.selectedUser).subscribe(
      (res:any) => {
        console.log(res);
        this.response = res['data'];
        console.log(this.response);
        this.userService.setResponse(this.response.userId, this.response.email);
        this.router.navigateByUrl('verify');
      },
      err => {
        if(err.status == 422){
          this.serverErrorMessages = err.error.join('<br>');

        }
        else{
          this.serverErrorMessages = "Something went wrong";
        }
      }
    )
  }

  resetForm(){
    this.selectedUser.fullName = "";
    this.selectedUser.designation = "";
    this.selectedUser.batch = 0;
    this.selectedUser.email = "";
    this.selectedUser.institute = "";
    this.selectedUser.phone_number = "";
    this.selectedUser.roll = 0;
    this.selectedUser.password = "";
    this.cPassword = "";
    this.selectedUser.isTeacher = this.isTeacher;
    this.serverErrorMessages = "";
  }

  hasAccount(){
    this.router.navigateByUrl('login');
  }


}
