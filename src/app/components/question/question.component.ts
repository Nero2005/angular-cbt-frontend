import { Component, DoCheck, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit, DoCheck {
  constructor() {}

  @Input() questionObjs?: any[];
  @Input() index?: number;
  @Input() setQuestionObjs?: any;
  @Input() fakeId?: string;

  question = '';
  optionA = '';
  optionB = '';
  optionC = '';
  optionD = '';
  correctOption = 'A';

  ngOnInit(): void {
    const cachedExams = localStorage.getItem('exams');
    if (cachedExams) {
      const examsCached: any[] = JSON.parse(cachedExams);
      const foundExamIndex = examsCached.findIndex(
        (e) => e.fakeId === this.fakeId
      );
      if (foundExamIndex > -1) {
        const foundExam = examsCached[foundExamIndex];
        if (foundExam.questions[this.index!]) {
          console.log(foundExam.questions[this.index!].correctOption);
          this.question = foundExam.questions[this.index!].question;
          this.optionA = foundExam.questions[this.index!].optionA;
          this.optionB = foundExam.questions[this.index!].optionB;
          this.optionC = foundExam.questions[this.index!].optionC;
          this.optionD = foundExam.questions[this.index!].optionD;
          this.correctOption = foundExam.questions[this.index!].correctOption;
          this.questionObjs![this.index!] = {
            question: this.question,
            optionA: this.optionA,
            optionB: this.optionB,
            optionC: this.optionC,
            optionD: this.optionD,
            correctOption: this.correctOption,
          };
          this.setQuestionObjs!(this.questionObjs!);
        }
      }
    }
  }

  ngDoCheck(): void {
    this.questionObjs![this.index!] = {
      question: this.question,
      optionA: this.optionA,
      optionB: this.optionB,
      optionC: this.optionC,
      optionD: this.optionD,
      correctOption: this.correctOption,
    };
    this.setQuestionObjs!(this.questionObjs!);
  }
}
