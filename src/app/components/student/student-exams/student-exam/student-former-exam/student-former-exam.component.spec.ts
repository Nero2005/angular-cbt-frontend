import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFormerExamComponent } from './student-former-exam.component';

describe('StudentFormerExamComponent', () => {
  let component: StudentFormerExamComponent;
  let fixture: ComponentFixture<StudentFormerExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentFormerExamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentFormerExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
