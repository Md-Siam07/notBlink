import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsStudentExamCardComponent } from './details-student-exam-card/details-student-exam-card.component';
import { DetailsTeacherExamCardComponent } from './details-teacher-exam-card/details-teacher-exam-card.component';
import { LoginComponent } from './login/login.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { StudentExamComponent } from './student-exam/student-exam.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
   // children: [{path:'', component: LoginComponent}]
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'userprofile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student/exam/:id',
    component: StudentExamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'teacher/examdetails/:id',
    component: DetailsTeacherExamCardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student/examdetails/:id',
    component: DetailsStudentExamCardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'verify',
    component: OtpVerificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
