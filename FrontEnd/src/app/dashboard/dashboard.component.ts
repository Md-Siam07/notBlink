import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';

declare var M: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  constructor(private examService: ExamService, private router: Router, private userService: UserService) { }
  @ViewChild('element') element:any;
  //test commit
  selectedExam: Exam = new Exam();
  userDetails = new User();
  exams: Exam[] = [];
  tempID : string = "";

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        //console.log(this.userDetails);
        //console.log(res.userID);
        this.selectedExam.teacherID = JSON.stringify(this.userDetails._id);
        //console.log("dashboard: " + JSON.stringify(this.userDetails._id));
      },
      (err:any) => {}
    );

    // this.examService.getExamList(this.userDetails._id).subscribe( (res:any) =>{
    //   this.examService.exams = res as Exam[];
    // });
  }
  
  

}
