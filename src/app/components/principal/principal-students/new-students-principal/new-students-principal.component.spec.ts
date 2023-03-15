import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStudentsPrincipalComponent } from './new-students-principal.component';

describe('NewStudentsPrincipalComponent', () => {
  let component: NewStudentsPrincipalComponent;
  let fixture: ComponentFixture<NewStudentsPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStudentsPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStudentsPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
