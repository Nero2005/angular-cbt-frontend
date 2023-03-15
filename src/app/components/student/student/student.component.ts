import { Component, OnInit } from '@angular/core';
import { UserState } from '../../../utils/typings.d';
import { UseRequestService } from '../../../services/use-request.service';
import { HttpVerbs } from 'src/app/utils/enums';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit {
  constructor(private useRequestService: UseRequestService) {}

  user?: UserState;

  examsCount = 0;

  subjectClassesCount = 0;

  futureExamsCount = 0;

  subjectTeachers?: string[] = [];

  ngOnInit(): void {
    const userJSON = localStorage.getItem('user');
    if (!userJSON || userJSON === 'undefined' || userJSON === 'null') {
      window.location.reload();
      return;
    }
    this.user = JSON.parse(userJSON);
    const { doRequest: getSubjectClasses } = this.useRequestService.useRequest({
      url: `/api/students/subject-classes?userId=${this.user!.id}`,
      method: HttpVerbs.GET,
    });
    getSubjectClasses().subscribe(({ data }) => {
      this.subjectClassesCount = data.length;
    });
    const { doRequest: getSubjectTeacher } = this.useRequestService.useRequest({
      url: `/api/teachers`,
      method: HttpVerbs.GET,
    });
    const { doRequest: getExamsByDate } = this.useRequestService.useRequest({
      url: `/api/exams-by-student?student=${this.user!.id}`,
      method: HttpVerbs.GET,
    });
    getExamsByDate().subscribe(({ data }) => {
      const filteredFuture = data.exams.filter(
        (exam: any) =>
          new Date(exam.startTime) > new Date() &&
          new Date(exam.startTime).getDay() === new Date().getDay()
      );
      const filteredCurrent = data.exams.filter(
        (exam: any) =>
          new Date(new Date(exam.startTime).getTime() + exam.duration * 60000) >
            new Date() && new Date(exam.startTime) < new Date()
      );
      this.futureExamsCount = filteredFuture.length;
      this.examsCount = filteredCurrent.length;
    });
    const sts: string[] = [];
    for (const s of this.user!.subjectClasses) {
      getSubjectTeacher({}, `?subjectClasses=${s.id}`).subscribe(
        ({ data, errors }) => {
          if (!errors || errors?.length === 0)
            sts.push(data.teachers?.[0].name);
        }
      );
    }
    this.subjectTeachers = sts;
  }
}
