import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { StudentExamService } from '../shared/student-exam.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-details-student-exam-card',
  templateUrl: './details-student-exam-card.component.html',
  styleUrls: ['./details-student-exam-card.component.css']
})
export class DetailsStudentExamCardComponent implements OnInit {

  month: string = "";
  participants: User[] = [];
  tempUser = new User();
  participantSet = new Set<string>();
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

  id: string = '';

  constructor(private studentExamService: StudentExamService, private route: ActivatedRoute, private router: Router, private examService: ExamService) { }
  examDetails = new Exam();
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    //console.log(this.id);
    this.studentExamService.getSingleExamDetails(this.id).subscribe(
      (res:any) => {
        this.examDetails = res as Exam;
        this.refreshParticipantList();
      },
      err => {}
    );
    //this.examDetails = this.studentExamService.selectedExam;
    //console.log(this.examDetails);
  }

  getExamDate(input: string): string{
    return input.substring(8,10);
  }

  getExamMonth(input: string): any{
    this.month = input.substring(5,7);
    //console.log('month: '+ this.month);
    return this.months.get(parseInt(this.month));
  }

  refreshParticipantList(){
    this.participantSet = new Set<string>();
    this.participants = [];
    //this.examDetails = this.examService.selectedExam;
    this.examDetails.participants.forEach(participantID => {
      this.participantSet.add(participantID);
    });
    console.log('participant set: ', this.examDetails.participants);
    this.participantSet.forEach(participantID => {
      this.examService.getParticipant(participantID).subscribe(
        (res:any) => {
          this.tempUser = res as User;
          this.participants.push(JSON.parse(JSON.stringify(this.tempUser)));
        },
        (err:any) => {}
      );
    });
  }

}
