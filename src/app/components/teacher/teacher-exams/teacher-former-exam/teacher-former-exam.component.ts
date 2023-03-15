import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UseRequestService } from 'src/app/services/use-request.service';
import { padZero } from 'src/app/utils';
import { LinkRoutes } from 'src/app/utils/enums';
import { IError, IExam, IResult, UserState } from 'src/app/utils/typings.d';

interface TeacherResult {
  name: string;
  marks?: number;
}

@Component({
  selector: 'app-teacher-former-exam',
  templateUrl: './teacher-former-exam.component.html',
  styleUrls: ['./teacher-former-exam.component.css'],
})
export class TeacherFormerExamComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  @Input() examId?: string;

  exam?: IExam;

  ngOnInit(): void {
    const { doRequest: getExamById } = this.useRequestService.useRequest({
      url: `/api/exams`,
      method: 'get',
    });
    getExamById({}, `/${this.examId}`).subscribe(({ data }) => {
      this.exam = data;
      if (!this.exam) return;
      const { doRequest: getResults } = this.useRequestService.useRequest({
        url: `/api/teachers/results?examId=${this.exam?.id}`,
        method: 'get',
      });
      getResults().subscribe(({ data, errors }) => {
        this.teacherResults = data;
        console.log(this.teacherResults);
      });
    });
  }

  teacherResults: TeacherResult[] = [];

  startTime = this.getMin();

  reExamErrors: IError[] = [];

  isError(field?: string) {
    return this.reExamErrors.findIndex((e) => e.field === field) > -1;
  }

  displayError(field?: string) {
    return this.reExamErrors
      .filter((e) => e.field === field)
      .map((e, i) => e.message);
  }

  toDate(value: string | number) {
    return new Date(value);
  }

  getMin() {
    return `${new Date().toISOString().split('T')[0]}T${padZero(
      new Date().getHours()
    )}:${padZero(new Date().getMinutes())}:00`;
  }

  submit() {
    const { doRequest: rescheduleExam } = this.useRequestService.useRequest({
      url: '/api/exams/reschedule',
      method: 'patch',
    });
    const st1 = new Date(this.startTime);
    const formData = {
      newStartTime: st1.toUTCString(),
    };
    console.log(formData);
    if (new Date(formData.newStartTime) < new Date()) {
      this.reExamErrors = [
        { message: 'Exam cannot be scheduled for the past' },
      ];
      return;
    }
    rescheduleExam(formData, `/${this.exam!.id}`).subscribe(
      ({ data, errors }) => {
        console.log(errors);
        this.reExamErrors = errors || [];
        if (this.reExamErrors.length === 0) {
          this.location.go(LinkRoutes.DASHBOARD);
          window.location.reload();
        }
      }
    );
  }
}
