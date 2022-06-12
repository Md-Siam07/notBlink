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
import { chartData } from '../shared/chart-data.model';
import { ChartDataService } from '../shared/chart-data.service';


declare var google: any;

@Component({
  selector: 'app-student-under-exam',
  templateUrl: './student-under-exam.component.html',
  styleUrls: ['./student-under-exam.component.css']
})
export class StudentUnderExamComponent implements OnInit {

  constructor(private cdata: ChartDataService, private examService: ExamService, private route: ActivatedRoute, private router: Router, private userService: UserService, private toastr: ToastrService ) {
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
  tempNotificationList = new BehaviorSubject<MyNotification[]>([]);
  onlySuspected = false;

  //
  inTime = 0;
  outTime = 0;
  cheatTime = 0;

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
          })
          this.examService.getParticipant(this.studentID).subscribe(
            (res:any) => {
              this.studentDetails = res as User;
              this.analysisNotification();
            },
            (err:any) => {}
          );
        }
      }
    );

    //this.
  }

  analysisNotification() {
    this.examService.getNotifications(this.examID).subscribe(
      (res:any) => {
        this.tempNotificationList.next(res);
        var left = null;
        var disconnected = null;

        for (var notification of this.tempNotificationList.value) {
          //console.log(notification.email, this.studentDetails.email);
          if (notification.email == this.studentDetails.email) {
            //console.log(notification.message);
            if (notification.message == "User has left the screen") {
              left = notification.time;
              //console.log(left);
            }
            else if (left != null && (notification.message == "User is back on screen" || notification.message == "Got disconnected" )) {
              //this.cheatTime += (new Date(notification.time) - new Date(left))
              //console.log(left, notification.time);
              this.cheatTime += (new Date(notification.time).getTime() - new Date(left).getTime())
              left = null;
              //console.log(this.cheatTime);
            }

            if (notification.message == "Started the exam") {
              disconnected = notification.time;
              //console.log(left);
            }
            else if (disconnected != null && notification.message == "Got disconnected") {
              //this.cheatTime += (new Date(notification.time) - new Date(left))
              //console.log(left, notification.time);
              this.inTime += (new Date(notification.time).getTime() - new Date(disconnected).getTime())
              disconnected = null;
              //console.log(this.cheatTime);
            }
          }
        }

        this.outTime = this.examDetails.duration * 60 * 1000 - this.inTime;
        this.inTime -= this.cheatTime;
        console.log(this.outTime);
        console.log(this.inTime);
        console.log(this.cheatTime);
        console.log("jjjj");

        this.cdata.setData(this.outTime, this.inTime, this.cheatTime);

        google.charts.load('current', {packages: ['corechart']});
        this.buildChart(this.cdata.getData());
        //console.log();
      },
      err => {}
    );
  }

  buildChart(datas: chartData[]) {
    var func=(chart:any) => {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');
      datas.forEach(item => {
        data.addRows([
          [item.name, item.count]
        ]);
      });

      var options = {
        title: "Time Distribution"
      }

      chart().draw(data, options);
    }

    var chart = () => new google.visualization.PieChart(document.getElementById('divPieChart'));
    var callback = () => func(chart);
    google.charts.setOnLoadCallback(callback);
  }

  drawChart() {
    // console.log(this.outTime);
    // console.log(this.inTime);
    // console.log(this.cheatTime);
    // console.log("aaaaa");
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
      ['Out from the exam', this.outTime],
      ['In Exam', this.inTime],
      ['Suspected', this.cheatTime]
    ]);

    var options = {
      title: "Time Distribution"
    }

    var chart = new google.visualization.PieChart(document.getElementById('divPieChart'));
    chart.draw(data, options);
  }

  notificationFilter() {
    this.onlySuspected = !this.onlySuspected;
  }

  loadNotification(){
    this.examService.getNotifications(this.examID).subscribe(
      (res:any) => {
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


  /*
  @ViewChild('PDF', {static:false}) notificationElement!: ElementRef;

  generatePDF() {
    let pdf = new jsPDF();

    pdf.html(this.notificationElement.nativeElement, {
      callback: (pdf) => {
        pdf.save("notification");
      }
    })
  }
  */

}
