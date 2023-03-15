import { Location } from '@angular/common';
import { Component, DoCheck, OnInit } from '@angular/core';
import { UseRequestService } from 'src/app/services/use-request.service';
import { getObjectFromQuery, getQueryFromObject } from 'src/app/utils/api';
import { LinkRoutes } from 'src/app/utils/enums';
import { IExam, ITerm, UserState } from 'src/app/utils/typings.d';

@Component({
  selector: 'app-student-exams',
  templateUrl: './student-exams.component.html',
  styleUrls: ['./student-exams.component.css'],
})
export class StudentExamsComponent implements OnInit, DoCheck {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  user?: UserState;

  exams: IExam[] = [];
  currentExams: IExam[] = [];
  formerExams: IExam[] = [];

  search = '';

  terms: ITerm[] = [];

  result: string = getObjectFromQuery(window.location.search)['result'];
  examId: string = getObjectFromQuery(window.location.search)['examId'];

  ngDoCheck(): void {
    this.result = getObjectFromQuery(window.location.search)['result'];
    this.examId = getObjectFromQuery(window.location.search)['examId'];
  }

  ngOnInit(): void {
    const userJSON = localStorage.getItem('user');
    if (!userJSON || userJSON === 'undefined' || userJSON === 'null') {
      window.location.reload();
      return;
    }
    this.user = JSON.parse(userJSON);

    this.result = getObjectFromQuery(window.location.search)['result'];
    this.examId = getObjectFromQuery(window.location.search)['examId'];

    const { doRequest: getTerms } = this.useRequestService.useRequest({
      url: '/api/terms',
      method: 'get',
    });
    getTerms().subscribe(({ data }) => {
      this.terms = data;
    });
    console.log(this.examId);
    if (!this.examId && !this.result) this.loadExams();
  }

  loadExams() {
    const { doRequest: getExams } = this.useRequestService.useRequest({
      url: `/api/exams-by-student?student=${this.user!.id}`,
      method: 'get',
    });

    const query = window.location.search;
    let queryObj = getObjectFromQuery(query);
    queryObj = getQueryFromObject({
      name: this.search,
    });
    console.log(queryObj);

    this.location.go(
      `${LinkRoutes.DASHBOARD}${queryObj ? `&${queryObj}` : ''}`
    );
    getExams({}, `${queryObj ? `&${queryObj}` : ''}`).subscribe(({ data }) => {
      this.exams = data.exams.filter(
        (exam: any) => new Date(exam.startTime) > new Date()
      );
      this.currentExams = data.exams.filter(
        (exam: any) =>
          new Date(new Date(exam.startTime).getTime() + exam.duration * 60000) >
            new Date() && new Date(exam.startTime) < new Date()
      );
      this.formerExams = data.exams.filter(
        (exam: any) =>
          new Date(new Date(exam.startTime).getTime() + exam.duration * 60000) <
          new Date()
      );
    });
  }

  toDate(value: string | number) {
    return new Date(value);
  }

  getFormerExamsForTerm(termId: string) {
    return this.formerExams.filter((e) => e.term.id === termId);
  }

  toExam(examId: string) {
    let queryObj = getObjectFromQuery(window.location.search);
    queryObj = {
      examId,
    };
    return getQueryFromObject(queryObj);
  }

  toExamPage(examId: string) {
    this.location.go(`${LinkRoutes.DASHBOARD}?${this.toExam(examId)}`);
  }

  toResult(examId: string) {
    let queryObj = getObjectFromQuery(window.location.search);
    queryObj = {
      examId,
      result: true,
    };
    return getQueryFromObject(queryObj);
  }

  toResultPage(examId: string) {
    this.location.go(`${LinkRoutes.DASHBOARD}?${this.toResult(examId)}`);
  }
}
