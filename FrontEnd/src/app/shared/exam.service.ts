import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}
  
  postExam(exam: Exam, examQuestion: File){
    var formData: any = new FormData();
    formData.append('examName', exam.examName);
    formData.append('startTime', exam.startTime);
    formData.append('examDate', exam.examDate);
    formData.append('teacherID', exam.teacherID);
    formData.append('outSightTime', exam.outSightTime);
    formData.append('teacherName', exam.teacherName);
    formData.append('question', examQuestion);
    return this.http.post( environment.apiBaseUrl+'/createExam', formData );
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

  update(exam: Exam, examQuestion: File){
    var formData: any = new FormData();
    formData.append('examName', exam.examName);
    formData.append('startTime', exam.startTime);
    formData.append('examDate', exam.examDate);
    formData.append('teacherID', exam.teacherID);
    formData.append('teacherName', exam.teacherName);
    formData.append('question', examQuestion);
    ///console.log(exam, examQuestion);
    //console.log(exam);
    //console.log(environment.apiBaseUrl + '/exam' + `/${exam._id}`);
    return this.http.put(environment.apiBaseUrl + '/exam' + `/${exam._id}`, formData);
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
