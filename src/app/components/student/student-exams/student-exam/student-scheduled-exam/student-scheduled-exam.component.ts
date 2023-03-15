import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UseRequestService } from 'src/app/services/use-request.service';
import { IExam, IResult, UserState } from 'src/app/utils/typings.d';

@Component({
  selector: 'app-student-scheduled-exam',
  templateUrl: './student-scheduled-exam.component.html',
  styleUrls: ['./student-scheduled-exam.component.css'],
})
export class StudentScheduledExamComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  @Input() exam?: IExam;
  @Input() timeLeft?: number;

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
      url: `/api/students/results?examId=${this.exam?.id}&studentId=${this.user?.id}`,
      method: 'get',
    });
    getResult().subscribe(({ data, errors }) => {
      this.result = data;
      console.log(errors);
    });
  }

  toDate(value: string | number) {
    return new Date(value);
  }

  toFloor(value: number) {
    return Math.floor(value);
  }
}
