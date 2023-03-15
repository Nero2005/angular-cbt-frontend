import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HttpVerbs, LinkRoutes } from '../../utils/enums';
import { UserState } from '../../utils/typings.d';
import { UseRequestService } from '../../services/use-request.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private location: Location,
    private useRequestService: UseRequestService
  ) {}

  @Input() user?: UserState;

  signout() {
    const { doRequest: signout } = this.useRequestService.useRequest({
      url: '/api/users/signout',
      method: HttpVerbs.POST,
    });
    signout().subscribe(() => {
      this.location.go(LinkRoutes.LOGIN);
      window.location.reload();
    });
    console.log('signout');
  }

  goHome() {
    this.location.go(LinkRoutes.DASHBOARD);
  }

  ngOnInit(): void {}
}
