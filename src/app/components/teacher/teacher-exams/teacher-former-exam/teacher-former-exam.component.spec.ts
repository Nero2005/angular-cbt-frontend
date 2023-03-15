import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherFormerExamComponent } from './teacher-former-exam.component';

describe('TeacherFormerExamComponent', () => {
  let component: TeacherFormerExamComponent;
  let fixture: ComponentFixture<TeacherFormerExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherFormerExamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherFormerExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
