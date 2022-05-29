import { Component, OnInit } from '@angular/core';
import { Exam } from '../shared/exam.model';
import { StudentExamService } from '../shared/student-exam.service';

@Component({
  selector: 'app-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.css']
})
export class StudentExamComponent implements OnInit {
  calibrationDone:Boolean = false;

  constructor(private examService: StudentExamService) { }
  examDetails = new Exam();
  ngOnInit(): void {
    this.examDetails = this.examService.selectedExam;
  }

  clickCount:number[] = [0,0,0,0,0,0,0,0,0];
  clickDoneCount:number = 0;

  calibrationClick(id:number) {
    this.clickCount[id]++;
    if (this.clickCount[id] == 5)    this.clickDoneCount++;

    if (this.clickDoneCount == 9) {
      //alert("Calibration Done");
      this.calibrationDone = true;
    }
  }

}
