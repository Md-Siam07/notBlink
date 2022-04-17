import { Component, OnInit } from '@angular/core';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-details-teacher-exam-card',
  templateUrl: './details-teacher-exam-card.component.html',
  styleUrls: ['./details-teacher-exam-card.component.css']
})
export class DetailsTeacherExamCardComponent implements OnInit {

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
  participants: User[] = [];
  tempUser = new User();
  participantSet = new Set<string>();

  ngOnInit(): void {
    this.examDetails = this.examService.selectedExam;
    this.examDetails.participants.forEach(participantID => {
      this.participantSet.add(participantID);
    });
    this.participantSet.forEach(participantID => {
      this.examService.getParticipant(participantID).subscribe(
        (res:any) => {
          console.log('res: ', res);
          this.tempUser.fullName= res.fullName;
          this.tempUser.email = res.email;
          this.tempUser._id = res._id;
          this.tempUser.batch = res.batch;
          this.tempUser.designation = res.designation;
          this.tempUser.institute = res.institute;
          this.tempUser.isTeacher = res.isTeacher;
          this.tempUser.phone_number = res.phone_number;
          this.tempUser.roll = res.roll;
          console.log(this.tempUser);
          this.participants.push(JSON.parse(JSON.stringify(this.tempUser)));
        },
        (err:any) => {}
      );
    });
    console.log(this.participants);
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
