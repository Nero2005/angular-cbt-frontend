import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpVerbs, LinkRoutes } from '../../utils/enums';
import { IError, UserState } from '../../utils/typings.d';
import { UseRequestService } from '../../services/use-request.service';

interface FormData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  user?: UserState;

  ngOnInit(): void {
    const { doRequest: getUser } = this.useRequestService.useRequest({
      url: '/api/users/me',
      method: HttpVerbs.GET,
    });

    getUser().subscribe(({ data }) => {
      this.user = data;
      console.log(this.user);
      if (this.user) {
        this.location.go(LinkRoutes.DASHBOARD);
        window.location.reload();
      }
    });
  }

  email = '';
  password = '';
  errors: IError[] = [];

  submit() {
    const formData: FormData = {
      email: this.email,
      password: this.password,
    };

    const { doRequest: signin } = this.useRequestService.useRequest({
      url: '/api/users/signin',
      method: HttpVerbs.POST,
    });

    signin(formData).subscribe(({ data, errors }) => {
      this.errors = errors || [];
      console.log(this.errors);
      if (this.errors.length === 0) {
        console.log(data);
        this.location.go(LinkRoutes.DASHBOARD);
        window.location.reload();
      }
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
}
