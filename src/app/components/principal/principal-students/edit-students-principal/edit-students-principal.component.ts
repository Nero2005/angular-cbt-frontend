import { Location } from '@angular/common';
import { Component, DoCheck, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UseRequestService } from 'src/app/services/use-request.service';
import { getObjectFromQuery } from 'src/app/utils/api';
import { HttpVerbs, LinkRoutes } from 'src/app/utils/enums';
import { IError, ISubjectClass, UserState } from 'src/app/utils/typings.d';

interface FormData {
  name: string;
  email: string;
  subjectClasses: string[];
}

interface SubjectClass {
  [id: string]: boolean;
}

@Component({
  selector: 'app-edit-students-principal',
  templateUrl: './edit-students-principal.component.html',
  styleUrls: ['./edit-students-principal.component.css'],
})
export class EditStudentsPrincipalComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  faArrowLeft = faArrowLeft;

  currentStudent?: UserState;
  selected: SubjectClass = {};

  name = '';
  email = '';
  errors: IError[] = [];
  subjectClasses: ISubjectClass[] = [];

  ngOnInit(): void {
    const { doRequest: getStudentById } = this.useRequestService.useRequest({
      url: '/api/students',
      method: HttpVerbs.GET,
    });
    const queryObj = getObjectFromQuery(window.location.search);
    getStudentById({}, `/${queryObj.userId}`).subscribe(({ data }) => {
      this.currentStudent = data;
      this.name = data.name;
      this.email = data.email;
      this.currentStudent?.subjectClasses.forEach((sc) => {
        this.selected = { ...this.selected, [sc.id]: sc.inUse };
      });
    });
    const { doRequest: getSubjectClasses } = this.useRequestService.useRequest({
      url: `/api/subject-classes?inUse=true`,
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
    const { doRequest: putStudent } = this.useRequestService.useRequest({
      url: '/api/students',
      method: HttpVerbs.PUT,
    });
    const subjectClassesList = Object.keys(this.selected).filter(
      (key) => this.selected[key]
    );
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
    putStudent(formData, `/${queryObj.userId}`).subscribe(
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

  toStudentList() {
    this.location.go(LinkRoutes.DASHBOARD);
    window.location.reload();
  }
}
