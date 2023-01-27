import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentExamService } from '../shared/student-exam.service';
import { UserService } from '../shared/user.service';
import { MyNotification } from '../shared/notification.model';

@Component({
  selector: 'app-chunked-transmission-component',
  templateUrl: './chunked-transmission-component.component.html',
  styleUrls: ['./chunked-transmission-component.component.css'],
})
export class ChunkedTransmissionComponent implements OnInit {
  private isStreaming = false;
  private displayMediaStream: MediaStream = null!;
  private userMediaStream: MediaStream = null!;
  private deltaTime = 2000;

  constructor(
    private examService: StudentExamService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private studentService: StudentExamService
  ) {}

  async ngOnInit(): Promise<void> {
    this.displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    this.userMediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: any) {
    // this.studentService.notify()
    // TODO Send a plain notification
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any) {
    this.triggerStream();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event: any) {
    this.triggerStream();
  }

  triggerStream() {
    if (this.isStreaming) {
      this.isStreaming = false;
      return;
    }

    // get media recorders
    const displayMediaRecorder = new MediaRecorder(this.displayMediaStream);
    const userMediaRecorder = new MediaRecorder(this.userMediaStream);

    // these callbacks decide what to do with chunk streas
    displayMediaRecorder.ondataavailable = (e: BlobEvent) => {
      // TODO
      // this.studentService.putVdeoChunk(e.data, '');
    };

    userMediaRecorder.ondataavailable = (e: BlobEvent) => {
      // TODO
      // this.studentService.putVdeoChunk(e.data, '');
    };

    displayMediaRecorder.start(this.deltaTime);
    userMediaRecorder.start(this.deltaTime);
  }
}
