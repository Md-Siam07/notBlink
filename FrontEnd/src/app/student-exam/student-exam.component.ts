import { Component, OnInit } from '@angular/core';
import { Exam } from '../shared/exam.model';
import { StudentExamService } from '../shared/student-exam.service';

@Component({
  selector: 'app-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.css']
})
export class StudentExamComponent implements OnInit {

  constructor(private examService: StudentExamService) { }
  examDetails = new Exam();
  ngOnInit(): void {
    this.examDetails = this.examService.selectedExam;
  }

}
