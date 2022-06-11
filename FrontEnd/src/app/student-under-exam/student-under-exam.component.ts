import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { MyNotification } from '../shared/notification.model';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import io from 'socket.io-client';
import { BehaviorSubject, observable, Observable, tap, timer } from 'rxjs';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-student-under-exam',
  templateUrl: './student-under-exam.component.html',
  styleUrls: ['./student-under-exam.component.css']
})
export class StudentUnderExamComponent implements OnInit {

  constructor(private examService: ExamService, private route: ActivatedRoute, private router: Router, private userService: UserService, private toastr: ToastrService ) {
    timer(0,1000).pipe(tap(()=> this.loadNotification())).subscribe();
  }

  examID: string = '';
  studentID: string = '';
  examDetails = new Exam();
  teacherDetails = new User();
  studentDetails = new User();
  tempNotification = new MyNotification();
  //notifications: MyNotification[] = [];
  notificationList = new BehaviorSubject<MyNotification[]>([]);

  months =  new Map([
    [1, "JAN"],
    [2, "FEB"],
    [3, "MAR"],
    [4, "APR"],
    [5, "MAY"],
    [6, "JUN"],
    [7, "JUL"],
    [8, "AUG"],
    [9, "SEP"],
    [10, "OCT"],
    [11, "NOV"],
    [12, "DEC"]
  ]);


  ngOnInit(): void {
    this.examID = this.route.snapshot.params['id1'];
    this.studentID = this.route.snapshot.params['id2'];

    this.examService.getSingleExamDetails(this.examID).subscribe(
      (res:any) =>{
        this.examDetails = res as Exam;
        if (res == null) {
          this.toastr.error("Exam don't exist!")
          this.router.navigateByUrl('dashboard')
        }
        else {
          this.userService.getUserProfile().subscribe(
          (res:any) =>{
            this.teacherDetails = res['user'];
            //console.log(this.teacherDetails);
          })
          this.examService.getParticipant(this.studentID).subscribe(
            (res:any) => {
              this.studentDetails = res as User;
              //console.log(this.studentDetails);
            },
            (err:any) => {}
          );
        }
      }
    );

    //this.
  }

  loadNotification(){
    this.examService.getNotifications(this.examID).subscribe(
      (res:any) => {
        //this.tempNotification = res as MyNotification;
        //var email = res['email'] as string;
        //todo
        //console.log(email);
        //console.log(this.tempNotification);
        this.notificationList.next(res);
      },
      err => {}
    );
  }

  getExamDate(input: string): string{
    return input.substring(8,10);
  }

  getExamTime(input: string): string{
    return input.substring(11,19);
  }

  getExamMonth(input: string): any{
    var month = input.substring(5,7);
    return this.months.get(parseInt(month));
  }

  getNotificationType(message: string): string {
    if (message == 'Started the exam')
      return 'info';
    else if (message == 'Got disconnected')
      return 'warning';
    else if (message == 'User is back on screen')
      return 'success';
    else
      return 'danger';
  }

  @ViewChild('PDF', {static:false}) notificationElement!: ElementRef;

  generatePDF() {
    let pdf = new jsPDF();

    pdf.html(this.notificationElement.nativeElement, {
      callback: (pdf) => {
        pdf.save("notification");
      }
    })
  }

}
