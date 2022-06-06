import { Injectable } from '@angular/core';
import { Exam } from './exam.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MyNotification } from './notification.model';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  exams: Exam[] = [];
  selectedExam : Exam = new Exam();

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

  notify(notification: MyNotification, examCode: string, blob:Blob){
    console.log('sz:',blob.size);
    var formData: any = new FormData();
    formData.append('batch' , notification.batch);
    formData.append('cameraRecord' , notification.cameraRecord);
    formData.append('email' , notification.email);
    formData.append('fullName' , notification.fullName);
    formData.append('institute' , notification.institute);
    formData.append('message' , notification.message);
    formData.append('phone_number' , notification.phone_number);
    formData.append('screenRecord' , notification.screenRecord);
    var file = new File([blob], Date.now()+ '.mp4')
    //console.log(file)
    formData.append('record', file);
    //console.log(formData);
    return this.http.put(environment.apiBaseUrl + '/addEvidence/' + examCode, formData);
  }

  getSingleExamDetails(examID: string){
    return this.http.get(environment.apiBaseUrl + '/exam/' + examID);
  }

}
