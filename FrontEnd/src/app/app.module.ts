import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from 'src/user/user.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


//routes
import { appRoutes } from './routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserService } from './shared/user.service';

import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { TeacherExamCardComponent } from './teacher-exam-card/teacher-exam-card.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { StudentExamCardComponent } from './student-exam-card/student-exam-card.component';
import { StudentExamComponent } from './student-exam/student-exam.component';
import { WindowMonitoringComponent } from './student-exam/window-monitoring/window-monitoring.component';
import { ScreenRecordComponent } from './student-exam/screen-record/screen-record.component';
import { DetailsTeacherExamCardComponent } from './details-teacher-exam-card/details-teacher-exam-card.component';
import { DetailsStudentExamCardComponent } from './details-student-exam-card/details-student-exam-card.component';
import { EyeTrackComponent } from './student-exam/eye-track/eye-track.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignUpComponent,
    DashboardComponent,
    LoginComponent,
    UserProfileComponent,
    TeacherExamCardComponent,
    NavBarComponent,
    StudentExamCardComponent,
    StudentExamComponent,
    WindowMonitoringComponent,
    ScreenRecordComponent,
    DetailsTeacherExamCardComponent,
    DetailsStudentExamCardComponent,
    EyeTrackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },UserService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
