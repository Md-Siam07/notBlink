import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { QuestionCreationService } from 'src/app/question-creation/services/question-creation.service';
import { QuestionHostDirective } from '../directives/question-host.directive';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ComponentMap } from '../utils/componentMap';

@Component({
  selector: 'app-mcq-question-wrapper',
  templateUrl: './mcq-question-wrapper.component.html',
  styleUrls: ['./mcq-question-wrapper.component.css']
})
export class McqQuestionWrapperComponent implements OnInit {

  @Input('examID') examID: string;
  questions: any[];
  @ViewChild(QuestionHostDirective, { static: true })
  questionHost!: QuestionHostDirective;
  mainForm: FormGroup;
  COMPONENT_MAP = new ComponentMap().COMPONENT_MAP;

  constructor(private questionService: QuestionCreationService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.mainForm = this.formBuilder.group({
      questionArray: this.formBuilder.array([]),
    });
    this.questionService.getMCQQuestion(this.examID).subscribe((questions: any[])=>{
      questions.forEach((question, index)=>{
        this.addComponent(question.questionType, index, question);
      })
    });
  }

  private createQuestionForm(questionType: string, index: number): FormGroup {
      return this.formBuilder.group({
        [index]: ''
      });
  }

  get questionArray(): FormArray {
    return this.mainForm.get('questionArray') as FormArray;
  }

  addComponent(componentType: string, index?: number, question?: any) {
    const viewContainerRef = this.questionHost.viewContainerRef;
    let componentRef = viewContainerRef.createComponent<any>(
      this.COMPONENT_MAP[componentType]
    );
    const questionForm = this.createQuestionForm(componentType, index);
    componentRef.instance.questionForm = questionForm;
    componentRef.instance.question = question;
    componentRef.instance.index = this.questionArray.length;
    this.questionArray.push(questionForm);
    // this.componentRefs.push(componentRef);
  }

  check(){
    console.log(this.mainForm.value)
  }

}
