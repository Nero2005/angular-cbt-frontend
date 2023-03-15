import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeachersPrincipalComponent } from './view-teachers-principal.component';

describe('ViewTeachersPrincipalComponent', () => {
  let component: ViewTeachersPrincipalComponent;
  let fixture: ComponentFixture<ViewTeachersPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTeachersPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTeachersPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
