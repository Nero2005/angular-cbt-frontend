import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalTeachersComponent } from './principal-teachers.component';

describe('PrincipalTeachersComponent', () => {
  let component: PrincipalTeachersComponent;
  let fixture: ComponentFixture<PrincipalTeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrincipalTeachersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
