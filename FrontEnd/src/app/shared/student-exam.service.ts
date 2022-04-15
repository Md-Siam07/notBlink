import { Injectable } from '@angular/core';
import { Exam } from './exam.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  exams: Exam[] = [];
  constructor(private http: HttpClient) { }

  joinExam(joinCredential: any, examCode: string){
    //console.log(joinCredential);
    //console.log('test: '+ joinCredential.userID);
    return this.http.put(environment.apiBaseUrl+'/joinExam/' + examCode, joinCredential);
  }

  retrieveExam(studentID: string){
    return this.http.get(environment.apiBaseUrl + '/student/exams/' + studentID);
  }

  leaveExam(leaveCredential: any, examCode: string){
    return this.http.put(environment.apiBaseUrl + '/student/exams/' + examCode, leaveCredential);
  }

}
