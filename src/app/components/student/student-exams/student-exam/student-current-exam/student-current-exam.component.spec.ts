import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCurrentExamComponent } from './student-current-exam.component';

describe('StudentCurrentExamComponent', () => {
  let component: StudentCurrentExamComponent;
  let fixture: ComponentFixture<StudentCurrentExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCurrentExamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCurrentExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
