import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UseRequestService } from 'src/app/services/use-request.service';
import { IExam } from 'src/app/utils/typings.d';

@Component({
  selector: 'app-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.css'],
})
export class StudentExamComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  @Input() examId?: string;
  @Input() result?: string;

  timeLeft = 0;
  currentExam?: IExam;

  ngOnInit(): void {
    const { doRequest: getExamById } = this.useRequestService.useRequest({
      url: `/api/exams`,
      method: 'get',
    });

    getExamById({}, `/${this.examId}`).subscribe(({ data }) => {
      this.currentExam = data;
      console.log('student-exam', this.currentExam);
      const findTimeLeft = () => {
        if (!this.currentExam) return;
        if (this.timeLeft < 0) return;
        const msLeft =
          new Date((this.currentExam as IExam).startTime).getTime() -
          new Date().getTime();
        this.timeLeft = Math.round(msLeft / 1000);
      };
      findTimeLeft();
      const timerId = setInterval(findTimeLeft, 1000);
      return () => clearInterval(timerId);
    });
  }
}
