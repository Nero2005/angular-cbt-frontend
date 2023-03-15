import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherNewExamComponent } from './teacher-new-exam.component';

describe('TeacherNewExamComponent', () => {
  let component: TeacherNewExamComponent;
  let fixture: ComponentFixture<TeacherNewExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherNewExamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherNewExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
