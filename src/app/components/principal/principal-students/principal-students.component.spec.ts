import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalStudentsComponent } from './principal-students.component';

describe('PrincipalStudentsComponent', () => {
  let component: PrincipalStudentsComponent;
  let fixture: ComponentFixture<PrincipalStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrincipalStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
