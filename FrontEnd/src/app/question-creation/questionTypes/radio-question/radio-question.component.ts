import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-radio-question',
  templateUrl: './radio-question.component.html',
  styleUrls: ['./radio-question.component.css']
})
export class RadioQuestionComponent implements OnInit {

  @Input('questionForm') questionForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    const prefix = String.fromCharCode(65 + this.options.length);
    this.options.push(new FormControl(''));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  check() {
    console.log(this.questionForm.value)
  }

  getOptionPrefix(index: number): string {
    return String.fromCharCode(65 + index);
  }


}
