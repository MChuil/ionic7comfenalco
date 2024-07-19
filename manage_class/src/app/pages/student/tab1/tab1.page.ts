import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public students: Student[];
  public studentSelected: Student;
  public showForm: boolean;
  public update: boolean;

  constructor(private sqliteService: SqliteManagerService,private alertService: AlertService,) {
    this.showForm = false;
    this.update  = false;
  }

  ngOnInit(): void {
    this.getStudents();  
    
  }

  getStudents(){
    this.sqliteService.getStudents().then((students: Student[])=>{
      this.students = students;
      console.log(this.students);
    });
  }

  onShowForm(){
    this.showForm = true;
  }

  onCloseForm(){
    this.update = false;
    this.studentSelected = new Student();
    this.showForm = false;
  }

  searchStudent($event){
    this.sqliteService.getStudents($event.detail.value).then((students: Student[])=>{
      this.students = students
    })
  }



  updateStudent(student: Student){
    this.studentSelected = student;
    this.update = true;
    this.onShowForm();
  }

  deleteStudentConfirm(student: Student){
    const self = this;
    this.alertService.alertConfirm('¿Seguro?', `¿Estas seguro que desea eliminar al estudiante ${student.name} ${student.surname}?`, function(){
      self.deleteStudent(student)
    })
  }


  deleteStudent(student: Student){
  this.sqliteService.deleteStudent(student).then(()=>{
    this.alertService.alertMessage('Exito', 'Estudiante eliminado...');
      this.getStudents();
    }).catch(err=>{
      this.alertService.alertMessage('Error', JSON.stringify(err));
    })
  }

}
