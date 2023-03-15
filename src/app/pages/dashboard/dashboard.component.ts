import { Location } from '@angular/common';
import { Component, DoCheck, OnInit } from '@angular/core';
import { HttpVerbs, LinkRoutes } from '../../utils/enums';
import { UserState } from '../../utils/typings.d';
import { UseRequestService } from '../../services/use-request.service';
import { Role, SideBarCurrent } from '../../utils/enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
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
      if (this.user === null) {
        this.location.go(LinkRoutes.LOGIN);
        window.location.reload();
      }
      this.displayDashboard();
      console.log(this.sidebar);
    });
  }

  sidebar = '';

  displayDashboard() {
    if (!this.user) {
      this.location.go(LinkRoutes.LOGIN);
      window.location.reload();
      return;
    }
    if (this.user.role === Role.PRINCIPAL) return this.displayPrincipal();
    else if (this.user.role === Role.TEACHER) return this.displayTeacher();
    else if (this.user.role === Role.STUDENT) return this.displayStudent();
    else {
      this.location.go(LinkRoutes.LOGIN);
      window.location.reload();
      return;
    }
  }

  displayStudent() {
    const current = localStorage.getItem('current');
    if (!current) return (this.sidebar = 'Student');
    if (current === SideBarCurrent.Dashboard) return (this.sidebar = 'Student');
    else if (current === SideBarCurrent.Exams)
      return (this.sidebar = 'StudentExams');
    else return (this.sidebar = 'Student');
  }

  displayTeacher() {
    const current = localStorage.getItem('current');
    if (!current) return (this.sidebar = 'Teacher');
    if (current === SideBarCurrent.Dashboard) return (this.sidebar = 'Teacher');
    else if (current === SideBarCurrent.Exams)
      return (this.sidebar = 'TeacherExams');
    else if (current === SideBarCurrent.Students)
      return (this.sidebar = 'TeacherStudents');
    else return (this.sidebar = 'Teacher');
  }

  displayPrincipal() {
    const current = localStorage.getItem('current');
    if (!current) return (this.sidebar = 'Principal');
    if (current === SideBarCurrent.Dashboard)
      return (this.sidebar = 'Principal');
    else if (current === SideBarCurrent.Teachers)
      return (this.sidebar = 'PrincipalTeachers');
    else if (current === SideBarCurrent.Students)
      return (this.sidebar = 'PrincipalStudents');
    else return (this.sidebar = 'Principal');
  }
}
