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
  file!: File;
  uploadata = new FormData();
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
    this.passwordMismatch = false;
    if(this.selectedUser.password!= this.cPassword){
        this.passwordMismatch = true;
        return;
    }

    this.userService.postUser(this.selectedUser, this.file).subscribe(
      (res:any) => {
        this.response = res['data'];
        this.userService.setResponse(this.response.userId, this.response.email);

        this.registerToDjangoBackend(this.response.userId);
        
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

  registerToDjangoBackend(id : string){
    console.log("reached here")
    this.uploadata.append('id', id);
    this.uploadata.append('username', "X");
    this.uploadata.append('img', this.file);
    
    this.userService.register(this.uploadata).subscribe(response=>{
      console.log(response.toString());
    });
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

  test(imageInp: any):void{
    console.log("hello")
  }

  hasAccount(){
    this.router.navigateByUrl('login');
  }

  uploadFile(event:any) {
    this.file = event.target.files[0];
  }
}
