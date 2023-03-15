import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UseRequestService } from 'src/app/services/use-request.service';
import { getObjectFromQuery } from 'src/app/utils/api';
import { HttpVerbs, LinkRoutes } from 'src/app/utils/enums';
import {
  IError,
  ISubjectClass,
  UpdateSubjectClass,
  UserState,
} from 'src/app/utils/typings.d';

interface FormData {
  name: string;
  email: string;
  subjectClasses: UpdateSubjectClass[];
}

interface SubjectClass {
  [id: string]: boolean;
}

@Component({
  selector: 'app-edit-teachers-principal',
  templateUrl: './edit-teachers-principal.component.html',
  styleUrls: ['./edit-teachers-principal.component.css'],
})
export class EditTeachersPrincipalComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  faArrowLeft = faArrowLeft;

  currentTeacher?: UserState;
  selected: SubjectClass = {};

  name = '';
  email = '';
  errors: IError[] = [];
  subjectClasses: ISubjectClass[] = [];

  ngOnInit(): void {
    const { doRequest: getTeacherById } = this.useRequestService.useRequest({
      url: '/api/teachers',
      method: HttpVerbs.GET,
    });
    const queryObj = getObjectFromQuery(window.location.search);
    getTeacherById({}, `/${queryObj.userId}`).subscribe(({ data }) => {
      this.currentTeacher = data;
      this.name = data.name;
      this.email = data.email;
      this.currentTeacher?.subjectClasses.forEach((sc) => {
        this.selected = { ...this.selected, [sc.id]: sc.inUse };
      });
      console.log(this.selected);
    });
    const { doRequest: getSubjectClasses } = this.useRequestService.useRequest({
      url: `/api/subject-classes?inUse=false`,
      method: HttpVerbs.GET,
    });
    getSubjectClasses().subscribe(({ data }) => {
      this.subjectClasses = data;
    });
  }

  select(id: string) {
    const current = document.getElementById(id);
    if (!current) throw new Error();
    // (current as HTMLInputElement).value === "off"
    const value = !this.selected[id] ? 'on' : 'off';
    (current as HTMLInputElement).value = value;
    this.selected = { ...this.selected, [id]: value === 'on' };
    console.log('from select', this.selected);
  }

  isError(field?: string) {
    return this.errors.findIndex((e) => e.field === field) > -1;
  }

  displayError(field?: string) {
    return this.errors
      .filter((e) => e.field === field)
      .map((e, i) => e.message);
  }

  submit() {
    const { doRequest: putTeacher } = this.useRequestService.useRequest({
      url: '/api/teachers',
      method: HttpVerbs.PUT,
    });
    const subjectClassesList = Object.keys(this.selected).map((key) => ({
      id: key,
      inUse: this.selected[key],
    }));
    if (subjectClassesList.length < 1) {
      this.errors = [{ message: 'Subject Classes are required' }];
      return;
    }
    const formData: FormData = {
      name: this.name,
      email: this.email,
      subjectClasses: subjectClassesList,
    };
    console.log(formData);
    const queryObj = getObjectFromQuery(window.location.search);
    putTeacher(formData, `/${queryObj.userId}`).subscribe(
      ({ data, errors }) => {
        this.errors = errors || [];
        console.log(this.errors);
        if (this.errors.length === 0) {
          this.location.go(LinkRoutes.DASHBOARD);
          window.location.reload();
        }
      }
    );
  }

  toTeacherList() {
    this.location.go(LinkRoutes.DASHBOARD);
    window.location.reload();
  }
}
