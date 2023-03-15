import { Component, OnInit } from '@angular/core';
import { UserState } from '../../../utils/typings.d';
import { UseRequestService } from '../../../services/use-request.service';
import { HttpVerbs } from 'src/app/utils/enums';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent implements OnInit {
  constructor(private useRequestService: UseRequestService) {}

  user?: UserState;

  studentsCount = 0;

  examsCount = 0;

  subjectClassesCount = 0;

  futureExamsCount = 0;

  ngOnInit(): void {
    const userJSON = localStorage.getItem('user');
    if (!userJSON || userJSON === 'undefined' || userJSON === 'null') {
      window.location.reload();
      return;
    }
    this.user = JSON.parse(userJSON);
    const { doRequest: getSubjectClasses } = this.useRequestService.useRequest({
      url: `/api/teachers/subject-classes?userId=${this.user!.id}`,
      method: HttpVerbs.GET,
    });
    getSubjectClasses().subscribe(({ data }) => {
      this.subjectClassesCount = data.count;
    });
    const { doRequest: getTeachersStudents } =
      this.useRequestService.useRequest({
        url: `/api/teachers/students?userId=${this.user!.id}`,
        method: HttpVerbs.GET,
      });
    getTeachersStudents().subscribe(({ data }) => {
      this.studentsCount = data.count;
    });

    const { doRequest: getExamsByDate } = this.useRequestService.useRequest({
      url: `/api/exams-by-teacher?teacher=${this.user!.id}`,
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
