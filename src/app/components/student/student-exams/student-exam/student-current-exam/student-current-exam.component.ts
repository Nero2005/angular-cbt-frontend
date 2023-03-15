import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UseRequestService } from 'src/app/services/use-request.service';
import { LinkRoutes } from 'src/app/utils/enums';
import { IExam, IResult, UserState } from 'src/app/utils/typings.d';

interface OptionPicked {
  [id: string]: string;
}

@Component({
  selector: 'app-student-current-exam',
  templateUrl: './student-current-exam.component.html',
  styleUrls: ['./student-current-exam.component.css'],
})
export class StudentCurrentExamComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  @Input() exam?: IExam;

  user?: UserState;

  result?: IResult;
  selected: OptionPicked = {};
  timeLeft = 0;

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
      console.log(errors);
      this.result = data;
    });
    const timeToSubmit = () => {
      const endTime = new Date(
        new Date(this.exam!.startTime).getTime() + this.exam!.duration * 60000
      );
      const t = Math.round((endTime.getTime() - new Date().getTime()) / 1000);
      this.timeLeft = t;
      if (t < 0) {
        console.log('submitting');
        this.submit();
      }
    };
    const timerId = setInterval(timeToSubmit, 1000);
  }

  setSelected(qId: string, option: string) {
    this.selected = { ...this.selected, [qId]: option };
  }

  submit() {
    const { doRequest: submitExam } = this.useRequestService.useRequest({
      url: `/api/students/submit-response`,
      method: 'post',
      onSuccess: () => window.location.reload(),
    });
    const responses = this.exam!.questions.map((q) => ({
      examId: this.exam!.id,
      studentId: this.user?.id,
      questionId: q.id,
      optionPicked: this.selected[q.id] ? this.selected[q.id] : '',
    }));
    console.log(responses);
    submitExam({ responses }).subscribe(() => {
      this.location.go(LinkRoutes.DASHBOARD);
      window.location.reload();
    });
  }

  toFloor(value: number) {
    return Math.floor(value);
  }
}
