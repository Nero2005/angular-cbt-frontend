import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTeachersPrincipalComponent } from './new-teachers-principal.component';

describe('NewTeachersPrincipalComponent', () => {
  let component: NewTeachersPrincipalComponent;
  let fixture: ComponentFixture<NewTeachersPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTeachersPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTeachersPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
