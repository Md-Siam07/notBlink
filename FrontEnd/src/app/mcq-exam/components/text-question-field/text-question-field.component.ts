import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-question-field',
  templateUrl: './text-question-field.component.html',
  styleUrls: ['./text-question-field.component.css']
})
export class TextQuestionFieldComponent implements OnInit {

  @Input('questionForm') questionForm: FormGroup;
  @Input('question') question: any;
  @Input('index') index: number;

  constructor() { }

  ngOnInit(): void {
  }

}
