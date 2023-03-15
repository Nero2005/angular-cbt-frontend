import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTeachersPrincipalComponent } from './edit-teachers-principal.component';

describe('EditTeachersPrincipalComponent', () => {
  let component: EditTeachersPrincipalComponent;
  let fixture: ComponentFixture<EditTeachersPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTeachersPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTeachersPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
