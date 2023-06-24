import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-question-field',
  templateUrl: './radio-question-field.component.html',
  styleUrls: ['./radio-question-field.component.css']
})
export class RadioQuestionFieldComponent implements OnInit {

  @Input('questionForm') questionForm: FormGroup;
  @Input('question') question: any;
  @Input('index') index: number;

  constructor() { }

  ngOnInit(): void {
  }

  getOptionPrefix(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
