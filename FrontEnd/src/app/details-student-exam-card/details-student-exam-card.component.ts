import { Component, OnInit } from '@angular/core';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';

@Component({
  selector: 'app-details-student-exam-card',
  templateUrl: './details-student-exam-card.component.html',
  styleUrls: ['./details-student-exam-card.component.css']
})
export class DetailsStudentExamCardComponent implements OnInit {

  month: string = "";

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

  constructor(private examService: ExamService) { }
  examDetails = new Exam();
  ngOnInit(): void {
    this.examDetails = this.examService.selectedExam;
  }

  getExamDate(input: string): string{
    return input.substring(8,10);
  }

  getExamMonth(input: string): any{
    this.month = input.substring(5,7);
    console.log('month: '+ this.month);
    return this.months.get(parseInt(this.month));
  }

  getPartipantList(exam: Exam){

  }

}
