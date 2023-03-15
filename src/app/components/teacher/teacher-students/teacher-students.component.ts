import { Component, OnInit } from '@angular/core';
import { UserState } from '../../../utils/typings.d';
import { UseRequestService } from '../../../services/use-request.service';
import { HttpVerbs } from 'src/app/utils/enums';

@Component({
  selector: 'app-teacher-students',
  templateUrl: './teacher-students.component.html',
  styleUrls: ['./teacher-students.component.css'],
})
export class TeacherStudentsComponent implements OnInit {
  constructor(private useRequestService: UseRequestService) {}

  user?: UserState;

  studentOpen = localStorage.getItem('studentsOpen');

  students: UserState[] = [];

  ngOnInit(): void {
    const userJSON = localStorage.getItem('user');
    if (!userJSON || userJSON === 'undefined' || userJSON === 'null') {
      window.location.reload();
      return;
    }
    this.user = JSON.parse(userJSON);
  }

  setStudentsOpen(studentId: string) {
    const { doRequest: getStudents } = this.useRequestService.useRequest({
      url: `/api/teachers/students`,
      method: HttpVerbs.GET,
    });
    localStorage.setItem('studentsOpen', studentId);
    getStudents({}, `/${studentId}`).subscribe(({ data }) => {
      console.log(data);
      this.students = data.students;
    });
  }
}
