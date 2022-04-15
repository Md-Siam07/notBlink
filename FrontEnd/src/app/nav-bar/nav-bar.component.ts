import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }
  status: boolean = false;
  ngOnInit(): void {
    //this.status = this.userService.loginStatus;
  }

  getStatus():boolean{
    return this.userService.loginStatus;
  }

  // loginClicked(){
  //   if(this.userService.loginStatus)
  //     this.router.navigateByUrl('dashboard');
  //   else
  //     this.router.navigateByUrl('login');
  // }

}
