import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faPen } from '@fortawesome/free-solid-svg-icons';
import { UseRequestService } from 'src/app/services/use-request.service';
import { getObjectFromQuery, getQueryFromObject } from 'src/app/utils/api';
import { HttpVerbs, LinkRoutes } from 'src/app/utils/enums';
import { UserState } from 'src/app/utils/typings.d';

@Component({
  selector: 'app-view-teachers-principal',
  templateUrl: './view-teachers-principal.component.html',
  styleUrls: ['./view-teachers-principal.component.css'],
})
export class ViewTeachersPrincipalComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  faPen = faPen;
  faArrowLeft = faArrowLeft;

  currentTeacher?: UserState;

  ngOnInit(): void {
    const { doRequest: getTeacherById } = this.useRequestService.useRequest({
      url: '/api/teachers',
      method: HttpVerbs.GET,
    });
    const queryObj = getObjectFromQuery(window.location.search);
    getTeacherById({}, `/${queryObj.userId}`).subscribe(({ data }) => {
      this.currentTeacher = data;
    });
  }

  editTeacherPage() {
    this.location.go(`${LinkRoutes.DASHBOARD}/?${this.editTeacher()}`);
  }

  editTeacher() {
    const queryObj = {
      userId: getObjectFromQuery(window.location.search)['userId'],
      action: 'EDIT',
    };
    const query = getQueryFromObject(queryObj);
    return query;
  }

  toTeacherList() {
    this.location.go(LinkRoutes.DASHBOARD);
    window.location.reload();
  }
}
