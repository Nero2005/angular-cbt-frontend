import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UseRequestService } from 'src/app/services/use-request.service';
import { HttpVerbs, LinkRoutes } from 'src/app/utils/enums';
import { IError, ISubjectClass } from 'src/app/utils/typings.d';

interface FormData {
  name: string;
  email: string;
  subjectClasses: string[];
}

interface SubjectClass {
  [id: string]: boolean;
}

@Component({
  selector: 'app-new-teachers-principal',
  templateUrl: './new-teachers-principal.component.html',
  styleUrls: ['./new-teachers-principal.component.css'],
})
export class NewTeachersPrincipalComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  faArrowLeft = faArrowLeft;

  selected: SubjectClass = {};

  name = '';
  email = '';
  errors: IError[] = [];
  subjectClasses: ISubjectClass[] = [];

  select(id: string) {
    const current = document.getElementById(id);
    if (!current) throw new Error();
    // (current as HTMLInputElement).value === "off"
    const value = !this.selected[id] ? 'on' : 'off';
    (current as HTMLInputElement).value = value;
    this.selected = { ...this.selected, [id]: value === 'on' };
  }

  ngOnInit(): void {
    const { doRequest: getSubjectClasses } = this.useRequestService.useRequest({
      url: `/api/subject-classes?inUse=false`,
      method: HttpVerbs.GET,
    });
    getSubjectClasses().subscribe(({ data, errors }) => {
      this.subjectClasses = data;
    });
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
    const { doRequest: newTeacher } = this.useRequestService.useRequest({
      url: '/api/teachers',
      method: HttpVerbs.POST,
    });
    newTeacher(formData).subscribe(({ data, errors }) => {
      this.errors = errors || [];
      console.log(this.errors);
      if (this.errors.length === 0) {
        this.location.go(LinkRoutes.DASHBOARD);
        window.location.reload();
      }
    });
  }

  toTeacherList() {
    this.location.go(LinkRoutes.DASHBOARD);
    window.location.reload();
  }
}
