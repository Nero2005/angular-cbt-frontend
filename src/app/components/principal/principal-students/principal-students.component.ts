import { Location } from '@angular/common';
import { Component, DoCheck, OnInit } from '@angular/core';
import {
  faArrowLeft,
  faArrowRight,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { UseRequestService } from 'src/app/services/use-request.service';
import { getObjectFromQuery, getQueryFromObject } from 'src/app/utils/api';
import { Action, HttpVerbs, LinkRoutes } from 'src/app/utils/enums';
import { UserState } from 'src/app/utils/typings.d';

@Component({
  selector: 'app-principal-students',
  templateUrl: './principal-students.component.html',
  styleUrls: ['./principal-students.component.css'],
})
export class PrincipalStudentsComponent implements OnInit, DoCheck {
  constructor(
    private location: Location,
    private useRequestService: UseRequestService
  ) {}

  ngDoCheck(): void {
    this.setAction(
      (getObjectFromQuery(window.location.search)['action'] as Action) ||
        Action.LIST
    );
  }

  action: Action = Action.LIST;

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faPlus = faPlus;
  faTrash = faTrash;

  students: UserState[] = [];
  studentsCount = 0;
  maxPage = Math.ceil(this.studentsCount / 10);
  page: number = 0;

  search = '';

  setAction(action: Action) {
    this.action = action;
  }

  deleteStudent(studentId: string) {
    const { doRequest: deleteStudent } = this.useRequestService.useRequest({
      url: `/api/students`,
      method: HttpVerbs.DELETE,
    });
    deleteStudent({}, `/${studentId}`).subscribe(() =>
      window.location.reload()
    );
  }

  ngOnInit(): void {
    this.setAction(
      (getObjectFromQuery(window.location.search)['action'] as Action) ||
        Action.LIST
    );
    if (this.action === Action.LIST) this.loadStudents();
  }

  loadStudents() {
    const { doRequest: getStudents } = this.useRequestService.useRequest({
      url: `/api/students`,
      method: HttpVerbs.GET,
    });
    const query = window.location.search;
    const queryObj = getObjectFromQuery(query);
    console.log(query);
    if (!queryObj['page']) {
      queryObj['page'] = 0;
    }
    console.log(queryObj);
    const newQuery = getQueryFromObject(queryObj);
    console.log(newQuery);
    this.location.go(`${LinkRoutes.DASHBOARD}?${newQuery}`);
    this.page = parseInt(queryObj['page']);
    getStudents({}, `/?name=${this.search}&${newQuery}`).subscribe(
      ({ data }) => {
        this.students = data.students;
        this.studentsCount = data.count;
        this.maxPage = Math.ceil(this.studentsCount / 10);
        console.log(this.studentsCount);
      }
    );
  }

  newStudent() {
    this.location.go(`${LinkRoutes.DASHBOARD}?${this.toNew()}`);
    this.setAction(Action.NEW);
  }

  toNew() {
    const queryObj = {
      action: 'NEW',
    };
    const newQuery = getQueryFromObject(queryObj);
    return newQuery;
  }

  viewStudentPage(studentId: string) {
    this.location.go(`${LinkRoutes.DASHBOARD}/?${this.viewStudent(studentId)}`);
    this.setAction(Action.VIEW);
    console.log(this.action);
  }

  viewStudent(userId: string) {
    const queryObj = {
      userId,
      action: 'VIEW',
    };
    const query = getQueryFromObject(queryObj);
    return query;
  }

  incPage() {
    this.page++;
    const queryObj = getObjectFromQuery(window.location.search);
    queryObj['page'] = parseInt(this.page.toString());
    const newQuery = getQueryFromObject(queryObj);
    console.log(newQuery);
    this.location.go(`${LinkRoutes.DASHBOARD}?${newQuery}`);
    this.loadStudents();
  }

  decPage() {
    this.page--;
    const queryObj = getObjectFromQuery(window.location.search);
    queryObj['page'] = parseInt(this.page.toString());
    const newQuery = getQueryFromObject(queryObj);
    console.log(newQuery);
    this.location.go(`${LinkRoutes.DASHBOARD}?${newQuery}`);
    this.loadStudents();
  }
}
