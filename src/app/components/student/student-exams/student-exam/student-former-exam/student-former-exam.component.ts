import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UseRequestService } from 'src/app/services/use-request.service';
import { Option } from 'src/app/utils/enums';
import { IExam, IResult, UserState } from 'src/app/utils/typings.d';

@Component({
  selector: 'app-student-former-exam',
  templateUrl: './student-former-exam.component.html',
  styleUrls: ['./student-former-exam.component.css'],
})
export class StudentFormerExamComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  @Input() exam?: IExam;

  user?: UserState;

  result?: IResult;

  ngOnInit(): void {
    const userJSON = localStorage.getItem('user');
    if (!userJSON || userJSON === 'undefined' || userJSON === 'null') {
      window.location.reload();
      return;
    }
    this.user = JSON.parse(userJSON);

    const { doRequest: getResult } = this.useRequestService.useRequest({
      url: `/api/students/results?examId=${this.exam!.id}&studentId=${
        this.user?.id
      }`,
      method: 'get',
    });
    getResult().subscribe(({ data, errors }) => {
      this.result = data;
      console.log(data);
      console.log(errors);
      console.log(this.exam?.questions);
    });
  }

  findCQ(qId: string) {
    return (
      this.result!.correctQuestions.findIndex((cq) => cq.questionId === qId) >
      -1
    );
  }

  findCQForOption(qId: string, option: string) {
    return (
      this.result!.correctQuestions.findIndex(
        (cq) => cq.questionId === qId && cq.optionPicked === option
      ) > -1
    );
  }

  findICQForOption(qId: string, option: string) {
    return (
      this.result!.incorrectQuestions.findIndex(
        (cq) => cq.questionId === qId && cq.optionPicked === option
      ) > -1
    );
  }
}
