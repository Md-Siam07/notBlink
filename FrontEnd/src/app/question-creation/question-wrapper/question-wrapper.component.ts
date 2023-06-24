import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { QuestionCreatorDirective } from '../directives/question-creator.directive';
import { ComponentMap } from '../utils/componentMap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OptionsModalComponent } from './options-modal/options-modal.component';
import { QuestionCreationService } from '../services/question-creation.service';

@Component({
  selector: 'app-question-wrapper',
  templateUrl: './question-wrapper.component.html',
  styleUrls: ['./question-wrapper.component.css']
})
export class QuestionWrapperComponent implements OnInit {

  @Input('examID') examID!: string;
  @Input('questions') questions!: any[];
  @ViewChild(QuestionCreatorDirective, {static: true}) questionHost!: QuestionCreatorDirective;
  
  COMPONENT_MAP = new ComponentMap().COMPONENT_MAP;
  mainForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private questionService: QuestionCreationService) { }

  ngOnInit(): void {
    this.mainForm = this.formBuilder.group({
      questionArray: this.formBuilder.array([])
    });
  }

  ngAfterViewInit(): void {
    //set timeout to avoid error
    setTimeout(() => {
      this.addComponent('radio');
      this.addComponent('text')
    }, 0);
  }

  get questionArray(): FormArray {
    return this.mainForm.get('questionArray') as FormArray;
  }

  removeQuestion(index: number) {
    this.questionArray.removeAt(index);
  }

  private createQuestionForm(questionType: string): FormGroup {
    if(questionType=='radio'){
      return this.formBuilder.group({
        question: ['', Validators.required],
        options: this.formBuilder.array([], Validators.required),
        fullMarks: ['', Validators.required],
        correctAnswer: ['', Validators.required]
      });
    }
    else return this.formBuilder.group({
        question: ['', Validators.required],
        fullMarks: ['', Validators.required],
        correctAnswer: ['', Validators.required]
    })
  }
  
  addComponent(componentType: string) {
    const viewContainerRef = this.questionHost.viewContainerRef;
    let componentRef = viewContainerRef.createComponent<any>(this.COMPONENT_MAP[componentType]);
    const questionForm = this.createQuestionForm(componentType);
    componentRef.instance.questionForm = questionForm;
    this.questionArray.push(questionForm);
  }

  openModal() {
    const dialogRef = this.dialog.open(OptionsModalComponent);

    dialogRef.afterClosed().subscribe(questionType => {
      this.addComponent(questionType)
    });
  }

  save(){
    console.log(this.mainForm.value);
    this.questionService.addMCQQuestion(this.examID,{mcqQuestion: this.mainForm.value}).subscribe((res)=>{
      console.log('done')
    })
  }
}
