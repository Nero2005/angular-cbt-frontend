import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UseRequestService } from 'src/app/services/use-request.service';
import { deleteSavedExam, padZero } from 'src/app/utils';
import { LinkRoutes, Option } from 'src/app/utils/enums';
import { IError, ISubjectClass, UserState } from 'src/app/utils/typings.d';

interface FormData {
  questionNumber: number;
  duration: number;
  name: string;
  subjectClass: string;
  questions: {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: Option;
  }[];
  startTime: string;
}

@Component({
  selector: 'app-teacher-new-exam',
  templateUrl: './teacher-new-exam.component.html',
  styleUrls: ['./teacher-new-exam.component.css'],
})
export class TeacherNewExamComponent implements OnInit {
  constructor(
    private useRequestService: UseRequestService,
    private location: Location
  ) {}

  @Input() fakeId?: string;

  faArrowLeft = faArrowLeft;

  user?: UserState;

  questions: any[] = [];

  name = '';
  subjectClass = '';
  questionNumber = 0;
  duration = 0;
  startTime = this.getMin();

  questionObjs: any[] = [];

  setQuestionObjs(questionObjs: any[]) {
    this.questionObjs = questionObjs;
  }

  newExamErrors: IError[] = [];
  subjectClasses: ISubjectClass[] = [];

  getMin() {
    return `${new Date().toISOString().split('T')[0]}T${padZero(
      new Date().getHours()
    )}:${padZero(new Date().getMinutes())}:00`;
  }

  ngOnInit(): void {
    const userJSON = localStorage.getItem('user');
    if (!userJSON || userJSON === 'undefined' || userJSON === 'null') {
      window.location.reload();
      return;
    }
    this.user = JSON.parse(userJSON);
    const { doRequest: getSubjectClasses } = this.useRequestService.useRequest({
      url: `/api/teachers/subject-classes?userId=${this.user!.id}`,
      method: 'get',
    });
    getSubjectClasses().subscribe(({ data, errors }) => {
      this.subjectClasses = data.subjectClasses;
      if (!this.subjectClass) this.subjectClass = this.subjectClasses[0].id;
    });
    const cachedExams = localStorage.getItem('exams');
    if (cachedExams) {
      const examsCached: any[] = JSON.parse(cachedExams);

      const foundExamIndex = examsCached.findIndex(
        (e) => e.fakeId === this.fakeId
      );
      if (foundExamIndex == -1) return;
      const foundExam = examsCached[foundExamIndex];
      this.name = foundExam.name;
      this.subjectClass = foundExam.subjectClass;
      this.questionNumber = foundExam.questionNumber;
      this.duration = foundExam.duration;
      this.startTime = foundExam.startTime;
    }
  }

  isError(field?: string) {
    return this.newExamErrors.findIndex((e) => e.field === field) > -1;
  }

  displayError(field?: string) {
    return this.newExamErrors
      .filter((e) => e.field === field)
      .map((e, i) => e.message);
  }

  saveChanges() {
    const formData: FormData = {
      name: this.name,
      subjectClass: this.subjectClass,
      questions: this.questionObjs,
      startTime: this.startTime,
      questionNumber: Number(this.questionNumber),
      duration: Number(this.duration),
    };

    const cachedExams = localStorage.getItem('exams');
    if (!cachedExams) {
      localStorage.setItem(
        'exams',
        JSON.stringify([{ fakeId: this.fakeId, ...formData }])
      );
    } else {
      const examsCached: any[] = JSON.parse(cachedExams);
      const foundExamIndex = examsCached.findIndex(
        (e) => e.fakeId === this.fakeId
      );
      if (foundExamIndex > -1)
        examsCached[foundExamIndex] = { fakeId: this.fakeId, ...formData };
      else examsCached.push({ fakeId: this.fakeId, ...formData });
      localStorage.setItem('exams', JSON.stringify(examsCached));
    }
    console.log(formData);
  }

  submit() {
    const { doRequest: newExam } = this.useRequestService.useRequest({
      url: '/api/exams',
      method: 'post',
    });
    const st1 = new Date(this.startTime);
    const formData: FormData = {
      name: this.name,
      subjectClass: this.subjectClass,
      questions: this.questionObjs,
      startTime: st1.toUTCString(),
      questionNumber: Number(this.questionNumber),
      duration: Number(this.duration),
    };
    console.log(formData);
    if (new Date(formData.startTime) < new Date()) {
      this.newExamErrors = [
        { message: 'Exam cannot be scheduled for the past' },
      ];
      return;
    }
    if (formData.questions.length != formData.questionNumber) {
      this.newExamErrors = [{ message: 'Questions Not Complete' }];
      return;
    }
    newExam(formData).subscribe(({ data, errors }) => {
      console.log(errors);
      this.newExamErrors = errors || [];
      if (this.newExamErrors.length === 0) {
        deleteSavedExam(this.fakeId!);
        this.location.go(LinkRoutes.DASHBOARD);
        window.location.reload();
      }
    });
  }

  addQuestions() {
    this.questions = new Array(Number(this.questionNumber)).fill(1);
    const newNo = Number(this.questionNumber);
    const qObjsLength = this.questionObjs.length;
    if (newNo > qObjsLength) {
      const newQs = new Array(newNo - qObjsLength).fill(1);
      this.questionObjs = [...this.questionObjs, ...newQs];
    } else if (newNo < qObjsLength) {
      this.questionObjs = this.questionObjs.slice(0, newNo);
    }
  }

  toExamList() {
    this.location.go(LinkRoutes.DASHBOARD);
    window.location.reload();
  }
}
