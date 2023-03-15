import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faPen } from '@fortawesome/free-solid-svg-icons';
import { UseRequestService } from 'src/app/services/use-request.service';
import { getObjectFromQuery, getQueryFromObject } from 'src/app/utils/api';
import { HttpVerbs, LinkRoutes } from 'src/app/utils/enums';
import { UserState } from 'src/app/utils/typings.d';

@Component({
  selector: 'app-view-students-principal',
  templateUrl: './view-students-principal.component.html',
  styleUrls: ['./view-students-principal.component.css'],
})
export class ViewStudentsPrincipalComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  faPen = faPen;
  faArrowLeft = faArrowLeft;

  currentStudent?: UserState;

  ngOnInit(): void {
    const { doRequest: getStudentById } = this.useRequestService.useRequest({
      url: '/api/students',
      method: HttpVerbs.GET,
    });
    const queryObj = getObjectFromQuery(window.location.search);
    getStudentById({}, `/${queryObj.userId}`).subscribe(({ data }) => {
      this.currentStudent = data;
    });
  }

  editStudentPage() {
    this.location.go(`${LinkRoutes.DASHBOARD}/?${this.editStudent()}`);
  }

  editStudent() {
    const queryObj = {
      userId: getObjectFromQuery(window.location.search)['userId'],
      action: 'EDIT',
    };
    const query = getQueryFromObject(queryObj);
    return query;
  }

  toStudentList() {
    this.location.go(LinkRoutes.DASHBOARD);
    window.location.reload();
  }
}
