import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Exam } from '../shared/exam.model';
import { StudentExamService } from '../shared/student-exam.service';

@Component({
  selector: 'app-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.css']
})
export class StudentExamComponent implements OnInit {
  calibrationDone:Boolean = true;

  constructor(private examService: StudentExamService, private route: ActivatedRoute ) { }
  examDetails = new Exam();
  id: string = '';
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']; 
    this.examDetails = this.examService.selectedExam;
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
