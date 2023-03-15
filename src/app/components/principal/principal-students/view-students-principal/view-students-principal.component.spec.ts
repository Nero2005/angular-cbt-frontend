import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentsPrincipalComponent } from './view-students-principal.component';

describe('ViewStudentsPrincipalComponent', () => {
  let component: ViewStudentsPrincipalComponent;
  let fixture: ComponentFixture<ViewStudentsPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentsPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStudentsPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
