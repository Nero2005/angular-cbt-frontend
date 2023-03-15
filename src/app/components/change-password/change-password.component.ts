import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpVerbs, LinkRoutes } from '../../utils/enums';
import { IError } from '../../utils/typings.d';
import { UseRequestService } from '../../services/use-request.service';

interface FormData {
  oldPsw: string;
  newPsw: string;
  repeatedPsw: string;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  ngOnInit(): void {}

  oldPsw = '';
  newPsw = '';
  repeatedPsw = '';
  errors: IError[] = [];

  submit() {
    console.log('change');

    const { doRequest: changePassword } = this.useRequestService.useRequest({
      url: '/api/users/change-password',
      method: HttpVerbs.PATCH,
    });
    const formData: FormData = {
      oldPsw: this.oldPsw,
      newPsw: this.newPsw,
      repeatedPsw: this.repeatedPsw,
    };
    if (formData.newPsw !== formData.repeatedPsw) {
      this.errors = [{ message: 'Passwords are different' }];
      console.log(this.errors);
      return;
    }
    const { repeatedPsw, ...others } = formData;
    changePassword(others).subscribe(({ data, errors }) => {
      this.errors = errors || [];
      console.log(this.errors);
      if (this.errors.length === 0) {
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
