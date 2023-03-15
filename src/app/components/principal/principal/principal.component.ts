import { Component, OnInit } from '@angular/core';
import { UserState } from '../../../utils/typings.d';
import { UseRequestService } from '../../../services/use-request.service';
import { HttpVerbs } from 'src/app/utils/enums';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  constructor(private useRequestService: UseRequestService) {}

  user?: UserState;

  studentsCount = 0;

  examsCount = 0;

  futureExamsCount = 0;

  teachersCount = 0;

  ngOnInit(): void {
    const userJSON = localStorage.getItem('user');
    if (!userJSON || userJSON === 'undefined' || userJSON === 'null') {
      window.location.reload();
      return;
    }
    this.user = JSON.parse(userJSON);

    const { doRequest: getTeachers } = this.useRequestService.useRequest({
      url: `/api/teachers`,
      method: HttpVerbs.GET,
    });
    getTeachers().subscribe(({ data }) => {
      this.teachersCount = data.count;
    });
    const { doRequest: getStudents } = this.useRequestService.useRequest({
      url: `/api/students`,
      method: HttpVerbs.GET,
    });
    getStudents().subscribe(({ data }) => {
      this.studentsCount = data.count;
    });

    const { doRequest: getExamsByDate } = this.useRequestService.useRequest({
      url: `/api/exams`,
      method: HttpVerbs.GET,
    });
    getExamsByDate().subscribe(({ data }) => {
      const filteredFuture = data.exams.filter(
        (exam: any) => new Date(exam.startTime) > new Date()
      );
      const filteredCurrent = data.exams.filter(
        (exam: any) =>
          new Date(new Date(exam.startTime).getTime() + exam.duration * 60000) >
            new Date() && new Date(exam.startTime) < new Date()
      );
      this.futureExamsCount = filteredFuture.length;
      this.examsCount = filteredCurrent.length;
    });
  }
}
