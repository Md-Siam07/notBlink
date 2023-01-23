import { ConferenceComponent } from './conference/conference.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from 'src/user/user.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { NgxPrintModule } from 'ngx-print';


//routes
import { appRoutes } from './routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserService } from './shared/user.service';
import { SocketService } from './call/services/socket.service';
import { PeerService } from './call/services/peer.service';

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
import { SafePipe } from './safe.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { StudentUnderExamComponent } from './student-under-exam/student-under-exam.component';
import { FaceRecognitionComponent } from './student-exam/face-recognition/face-recognition.component';
import { CallComponent } from './call/components/call/call.component';
import { VideoPlayerComponent } from './call/components/video-player/video-player.component';

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
    SafePipe,
    OtpVerificationComponent,
    StudentUnderExamComponent,
    FaceRecognitionComponent,
    CallComponent,
    VideoPlayerComponent,
    ConferenceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // NgxPrintModule,
    ToastrModule.forRoot({
      timeOut: 3500,
      progressBar: true,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },UserService, AuthGuard, PeerService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
