import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LinkRoutes, SideBarCurrent } from '../../utils/enums';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(private location: Location) {}

  @Input() current?: string;

  @Input() role?: string;

  ngOnInit(): void {}

  setCurrent(current: string) {
    this.current = current;
    localStorage.setItem('current', current);
    this.location.go(LinkRoutes.DASHBOARD);
    window.location.reload();
  }
}
