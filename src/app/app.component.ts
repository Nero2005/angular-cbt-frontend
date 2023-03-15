import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpVerbs, LinkRoutes } from './utils/enums';
import { UserState } from './utils/typings.d';
import { UseRequestService } from './services/use-request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  user?: UserState;

  ngOnInit(): void {
    console.log('app init');
    const { doRequest: getUser } = this.useRequestService.useRequest({
      url: '/api/users/me',
      method: HttpVerbs.GET,
    });
    const { doRequest: refreshAccessToken } = this.useRequestService.useRequest(
      {
        url: '/api/users/refresh-token',
        method: HttpVerbs.POST,
      }
    );
    getUser().subscribe(({ data, errorStatus }) => {
      if (errorStatus === 463) {
        refreshAccessToken().subscribe(({ data }) => {
          console.log(463);
          this.user = data;
          console.log(this.user);
        });
      } else this.user = data;
      localStorage.setItem('user', JSON.stringify(this.user));
    });
  }
}
