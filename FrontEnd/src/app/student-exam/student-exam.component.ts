import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../shared/exam.model';
import { StudentExamService } from '../shared/student-exam.service';

@Component({
  selector: 'app-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.css']
})
export class StudentExamComponent implements OnInit {
  calibrationDone:Boolean = false;

  constructor(private examService: StudentExamService, private route: ActivatedRoute, private router: Router ) { }
  examDetails = new Exam();
  tempRemainingTime : number = 0;
  id: string = '';
  tempExamDate: string = '';
  ngOnInit(): void {
    
    this.id = this.route.snapshot.params['id'];
    this.examService.getSingleExamDetails(this.id).subscribe(
      (res:any) =>{
        this.examDetails = res as Exam;
      }
    );
    this.tempExamDate = this.examDetails.examDate + 'T' + this.examDetails.startTime + ":00";
    this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();
    console.log(this.tempRemainingTime)
    //if(this.tempRemainingTime>0) this.router.navigateByUrl('dashboard');
    // else if(this.tempRemainingTime + this.examDetails.duration*60*1000 > 0) this.router.navigateByUrl('dashboard');
    // else{
    //   setTimeout(()=>{
    //     this.router.navigateByUrl('dashboard');
    //   }, this.tempRemainingTime + this.examDetails.duration*60*1000)
    // }
  }

  clickCount:number[] = [0,0,0,0,0,0,0,0,0];
  clickDoneCount:number = 0;

  calibrationClick(id:number) {
    this.clickCount[id]++;

    const idDom = "pt" + (id + 1).toString();
    let btn = document.getElementById(idDom);
    if (btn) {
      console.log(((this.clickCount[id] + 1) * 0.2).toString());
      btn.style["opacity"] = ((this.clickCount[id] + 1) * 0.2).toString();
    }

    if (this.clickCount[id] == 5 && btn) {
      this.clickDoneCount++;
      //hide it
      btn.style.backgroundColor = "green";
    }

    if (this.clickDoneCount == 9) {
      //alert("Calibration Done");
      this.calibrationDone = true;
    }
  }
  

}
