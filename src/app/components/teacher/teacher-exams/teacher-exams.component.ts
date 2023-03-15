import { Location } from '@angular/common';
import { Component, DoCheck, OnInit } from '@angular/core';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UseRequestService } from 'src/app/services/use-request.service';
import { getObjectFromQuery, getQueryFromObject } from 'src/app/utils/api';
import { Action, LinkRoutes } from 'src/app/utils/enums';
import { IExam, ITerm, UserState } from 'src/app/utils/typings.d';
import { deleteSavedExam as dSavedExam } from 'src/app/utils';

@Component({
  selector: 'app-teacher-exams',
  templateUrl: './teacher-exams.component.html',
  styleUrls: ['./teacher-exams.component.css'],
})
export class TeacherExamsComponent implements OnInit, DoCheck {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  ngDoCheck(): void {
    this.action =
      (getObjectFromQuery(window.location.search)['action'] as Action) ||
      Action.LIST;
    this.fakeId = getObjectFromQuery(window.location.search)['fakeId'];
    this.examId = getObjectFromQuery(window.location.search)['examId'];
  }

  faPlus = faPlus;
  faTrash = faTrash;

  examId = getObjectFromQuery(window.location.search)['examId'];

  fakeId = getObjectFromQuery(window.location.search)['fakeId'];

  user?: UserState;

  action: Action = Action.LIST;

  exams: IExam[] = [];
  savedExams: any[] = [];
  currentExams: IExam[] = [];
  formerExams: IExam[] = [];

  search = '';

  terms: ITerm[] = [];

  getRandom() {
    return Math.random().toString();
  }

  ngOnInit(): void {
    const userJSON = localStorage.getItem('user');
    if (!userJSON || userJSON === 'undefined' || userJSON === 'null') {
      window.location.reload();
      return;
    }
    this.user = JSON.parse(userJSON);

    this.action =
      (getObjectFromQuery(window.location.search)['action'] as Action) ||
      Action.LIST;

    const { doRequest: getTerms } = this.useRequestService.useRequest({
      url: '/api/terms',
      method: 'get',
    });
    if (this.action === Action.LIST) this.loadExams();
    getTerms().subscribe(({ data }) => {
      this.terms = data;
    });

    const cachedExams = localStorage.getItem('exams');
    if (cachedExams) {
      const examsCached: any[] = JSON.parse(cachedExams);
      this.savedExams = examsCached;
    }
  }

  deleteSavedExam(fakeId: string) {
    dSavedExam(fakeId);
    window.location.reload();
  }

  toNew(fakeId?: string) {
    const query = window.location.search;
    const queryObj = getObjectFromQuery(query);
    queryObj['new'] = true;
    queryObj['action'] = Action.NEW;
    fakeId && (queryObj['fakeId'] = fakeId);
    const newQuery = getQueryFromObject(queryObj);
    return newQuery;
  }

  getFormerExamsForTerm(termId: string) {
    return this.formerExams.filter((e) => e.term.id === termId);
  }

  newExam() {
    this.location.go(`${LinkRoutes.DASHBOARD}?${this.toNew()}`);
    this.action = Action.NEW;
  }

  editSavedExam(fakeId: string) {
    this.location.go(`${LinkRoutes.DASHBOARD}?${this.toNew(fakeId)}`);
    this.action = Action.NEW;
  }

  toDate(value: string | number) {
    return new Date(value);
  }

  displayDate(startTime: string) {
    return `${this.toDate(startTime).toDateString()} ${this.toDate(
      startTime
    ).toLocaleTimeString()}`;
  }

  loadExams() {
    const query = window.location.search;
    const queryObj = getObjectFromQuery(query);

    const newQuery = getQueryFromObject({
      ...queryObj,
      name: this.search,
    });

    const { doRequest: getExams } = this.useRequestService.useRequest({
      url: `/api/exams-by-teacher?teacher=${this.user!.id}`,
      method: 'get',
    });

    this.location.go(
      `${LinkRoutes.DASHBOARD}${newQuery ? `?${newQuery}` : ''}`
    );
    getExams({}, `${this.search && `&${this.search}`}`).subscribe(
      ({ data }) => {
        this.exams = data.exams.filter(
          (exam: any) => new Date(exam.startTime) > new Date()
        );
        this.currentExams = data.exams.filter(
          (exam: any) =>
            new Date(
              new Date(exam.startTime).getTime() + exam.duration * 60000
            ) > new Date() && new Date(exam.startTime) < new Date()
        );
        this.formerExams = data.exams.filter(
          (exam: any) =>
            new Date(
              new Date(exam.startTime).getTime() + exam.duration * 60000
            ) < new Date()
        );
      }
    );
  }

  toResult(examId: string) {
    let queryObj = getObjectFromQuery(window.location.search);
    queryObj = {
      examId,
      result: true,
      action: Action.VIEW,
    };
    return getQueryFromObject(queryObj);
  }

  toResultPage(examId: string) {
    this.location.go(`${LinkRoutes.DASHBOARD}/?${this.toResult(examId)}`);
    this.action = Action.VIEW;
  }
}
