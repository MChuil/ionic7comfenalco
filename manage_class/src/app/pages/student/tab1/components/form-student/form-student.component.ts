import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-form-student',
  templateUrl: './form-student.component.html',
  styleUrls: ['./form-student.component.scss'],
})
export class FormStudentComponent  implements OnInit {

  @Input() student: Student;

  @Output() close: EventEmitter<boolean>

  public update: boolean;

 
  constructor(private alertService: AlertService, private sqliteService: SqliteManagerService) {
    this.close = new EventEmitter<boolean>();
  }

  ngOnInit() {
    if(!this.student){
      this.student = new Student();
    }else{
      this.update = true;
    }
  }

  createUpdateStudent(){
    if(this.update){ //actualizar
      this.sqliteService.updateStudent(this.student).then(()=>{
        this.alertService.alertMessage('Exito', 'Datos del estudiante actualizados...');
        this.update = false;
        this.student = null;
        this.onCloseForm();
      }).catch(err =>{
        this.alertService.alertMessage('Error', JSON.stringify(err))
      })
    }else{ //insertar
      this.sqliteService.createStudent(this.student).then((student)=>{
        this.alertService.alertMessage('Exito', 'Estudiante agregado correctamente');
        this.onCloseForm();
      }).catch(err =>{
        this.alertService.alertMessage('Error', JSON.stringify(err))
      })
    }
    
    
  }

  onCloseForm(){
    this.close.emit(true)
  }

}
