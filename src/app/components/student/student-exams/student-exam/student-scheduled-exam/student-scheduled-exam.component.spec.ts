import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentScheduledExamComponent } from './student-scheduled-exam.component';

describe('StudentScheduledExamComponent', () => {
  let component: StudentScheduledExamComponent;
  let fixture: ComponentFixture<StudentScheduledExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentScheduledExamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentScheduledExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
