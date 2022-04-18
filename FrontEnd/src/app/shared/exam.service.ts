import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Exam } from './exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  selectedExam : Exam = new Exam();
  exams : Exam[] = [];
  tempLink : string = "";
  constructor(private http: HttpClient) {}
  
  postExam(exam: Exam){
    return this.http.post( environment.apiBaseUrl+'/createExam', exam );
  }

  getExamList(userID: string){
    
    //console.log("my user id: "+ userID);
    this.tempLink = environment.apiBaseUrl+'/exams/' + userID;
    console.log(this.tempLink);
    return this.http.get( this.tempLink );
  }

  getSingleExamDetails(examID: string){
    return this.http.get(environment.apiBaseUrl + '/exam/' + examID);
  }

  update(exam: Exam){
    //console.log(exam);
    //console.log(environment.apiBaseUrl + '/exam' + `/${exam._id}`);
    return this.http.put(environment.apiBaseUrl + '/exam' + `/${exam._id}`, exam);
  } 
  
  deleteExam(exam:Exam){ 
    //console.log(exam._id);
    //console.log(environment.apiBaseUrl+ '/exams'+ `/${exam._id}`);
    return this.http.delete(environment.apiBaseUrl+ '/exams'+ `/${exam._id}`);

  }

  invite(inviteCredentials:any){
    //console.log(inviteCredentials);
    return this.http.post(environment.apiBaseUrl + '/invite', inviteCredentials);
  }

  getParticipant(participantID: string){
    return this.http.get(environment.apiBaseUrl + '/participantinfo/' + participantID);
  }

  kickFromExam(leaveCredential: any, examCode: string){
    return this.http.put(environment.apiBaseUrl + '/student/exams/' + examCode, leaveCredential);
  }


}
