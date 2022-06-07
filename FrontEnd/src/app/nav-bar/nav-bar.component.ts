import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { reduce } from 'rxjs';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  userDetails = new User();
  userid: string = "";
  isCollapsed: boolean = true;

  constructor(private userService: UserService, private router: Router) { }

  status: boolean = false;

  // background: string = 'red';
  // fontSize: number = 10;

  ngOnInit(): void {
    //this.status = this.userService.loginStatus;
  }

  getStatus():boolean{
    return localStorage.getItem('loginStatus') == 'true';
  }

  getProfile(){
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        this.userid = res._id;
        //console.log('siam')
        //console.log(this.userDetails);
        //console.log(res._id);
      },
      (err:any) => {}
    );
  }
  // loginClicked(){
  //   if(this.userService.loginStatus)
  //     this.router.navigateByUrl('dashboard');
  //   else
  //     this.router.navigateByUrl('login');
  // }

  // change() : string {
  //   return this.background;
  //   console.log('red');
  //   document.documentElement.style.cssText = "background-color: red";
  // }

  onLogout() {
    this.userService.deleteToken();
    this.userService.loginStatus = false;
    localStorage.setItem('loginStatus', 'false');
    this.router.navigateByUrl('/login');
  }

}
