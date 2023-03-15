import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { APIInterceptor } from './services/api-interceptor.service';
import { environment } from 'src/environments/environment';
import { environment as prodEnv } from 'src/environments/environment.prod';
import { TeacherComponent } from './components/teacher/teacher/teacher.component';
import { TeacherExamsComponent } from './components/teacher/teacher-exams/teacher-exams.component';
import { TeacherStudentsComponent } from './components/teacher/teacher-students/teacher-students.component';
import { PrincipalComponent } from './components/principal/principal/principal.component';
import { StudentComponent } from './components/student/student/student.component';
import { StudentExamsComponent } from './components/student/student-exams/student-exams.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PrincipalTeachersComponent } from './components/principal/principal-teachers/principal-teachers.component';
import { PrincipalStudentsComponent } from './components/principal/principal-students/principal-students.component';
import { EditStudentsPrincipalComponent } from './components/principal/principal-students/edit-students-principal/edit-students-principal.component';
import { NewStudentsPrincipalComponent } from './components/principal/principal-students/new-students-principal/new-students-principal.component';
import { ViewStudentsPrincipalComponent } from './components/principal/principal-students/view-students-principal/view-students-principal.component';
import { EditTeachersPrincipalComponent } from './components/principal/principal-teachers/edit-teachers-principal/edit-teachers-principal.component';
import { NewTeachersPrincipalComponent } from './components/principal/principal-teachers/new-teachers-principal/new-teachers-principal.component';
import { ViewTeachersPrincipalComponent } from './components/principal/principal-teachers/view-teachers-principal/view-teachers-principal.component';
import { StudentExamComponent } from './components/student/student-exams/student-exam/student-exam.component';
import { StudentFormerExamComponent } from './components/student/student-exams/student-exam/student-former-exam/student-former-exam.component';
import { StudentCurrentExamComponent } from './components/student/student-exams/student-exam/student-current-exam/student-current-exam.component';
import { StudentScheduledExamComponent } from './components/student/student-exams/student-exam/student-scheduled-exam/student-scheduled-exam.component';
import { TeacherNewExamComponent } from './components/teacher/teacher-exams/teacher-new-exam/teacher-new-exam.component';
import { TeacherFormerExamComponent } from './components/teacher/teacher-exams/teacher-former-exam/teacher-former-exam.component';
import { QuestionComponent } from './components/question/question.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    TeacherComponent,
    TeacherExamsComponent,
    TeacherStudentsComponent,
    PrincipalComponent,
    PrincipalTeachersComponent,
    PrincipalStudentsComponent,
    StudentComponent,
    StudentExamsComponent,
    ChangePasswordComponent,
    SidebarComponent,
    EditStudentsPrincipalComponent,
    NewStudentsPrincipalComponent,
    ViewStudentsPrincipalComponent,
    EditTeachersPrincipalComponent,
    NewTeachersPrincipalComponent,
    ViewTeachersPrincipalComponent,
    StudentExamComponent,
    StudentFormerExamComponent,
    StudentCurrentExamComponent,
    StudentScheduledExamComponent,
    TeacherNewExamComponent,
    TeacherFormerExamComponent,
    QuestionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
    {
      provide: 'BASE_API_URL',
      useValue: environment.production ? prodEnv.baseUrl : environment.baseUrl,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
