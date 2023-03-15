import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStudentsPrincipalComponent } from './edit-students-principal.component';

describe('EditStudentsPrincipalComponent', () => {
  let component: EditStudentsPrincipalComponent;
  let fixture: ComponentFixture<EditStudentsPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStudentsPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStudentsPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
