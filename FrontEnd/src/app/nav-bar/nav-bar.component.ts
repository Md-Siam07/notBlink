import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { reduce } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

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
