import { Component, OnInit } from '@angular/core';
import { Classes } from 'src/app/models/classes';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import { Student } from 'src/app/models/student';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  public  classes: Classes[];
  public objClass: Classes;
  public students: Student[];
  public showForm: boolean;
  public update: boolean;

  constructor( private sqliteService: SqliteManagerService, private alertService: AlertService) {
    this.showForm = false;
    this.classes = [];
    this.update = false;
  }

  ngOnInit(): void {
    this.getClasses();
    if(!this.objClass){
      this.objClass = new Classes();
      this.objClass.price = 0;
    }else{
      this.update = true;
    }

    
  }

  getClasses(){
    Promise.all([
      this.sqliteService.getStudents(),
      this.sqliteService.getClasses()
    ]).then(results => {
      this.students = results[0];
      this.classes = results[1];
      this.associate(this.students);
      console.log(this.classes);
    })
  }

  private associate(students: Student[]){
    this.classes.forEach(row =>{
      let student = students.find( s => s.id == row.id_student);
      if(student){
        row.student = student;
      }
    })
  }


  onShowForm(){
    this.showForm = true;
  }

  onCloseForm(){
    this.update = false;
    this.objClass = new Classes();
    this.showForm = false;
    this.getClasses();
  }

  createUpdateClass(){
    this.objClass.date_start = moment(this.objClass.date_start).format('YYYY-MM-DDTHH:mm')
    this.objClass.date_end = moment(this.objClass.date_end).format('YYYY-MM-DDTHH:mm')

    if(this.update){ //actualizar
      this.sqliteService.updateClass(this.objClass).then(()=>{
        this.alertService.alertMessage('Bien', 'Clase editada correctamente')
        this.onCloseForm();
      }).catch(err =>{
        this.alertService.alertMessage('Error', JSON.stringify(err))
      })
    }else{ //crear 
      this.sqliteService.createClass(this.objClass).then(() =>{
        this.alertService.alertMessage('Bien', 'Clase agregada correctamente')
        this.onCloseForm();
      }).catch(err =>{
        this.alertService.alertMessage('Error', JSON.stringify(err))
      })
    }
  }


  updateClass(classe: Classes){
    this.objClass = classe;
    this.update = true;
    this.onShowForm();
  }

  deleteClassConfirm(classe: Classes){
    const self = this
    this.alertService.alertConfirm(
      '¿Eliminar?', 
      '¿Esta seguro de eliminar la clase?', 
      function(){
        self.deleteClass(classe)
    } )
  }

  deleteClass(classe: Classes){
    this.sqliteService.deleteClass(classe).then(()=>{
      this.alertService.alertMessage('Bien', 'Clase eliminada correctamente');
      this.getClasses();
    }).catch(err =>{
      this.alertService.alertMessage('Error', JSON.stringify(err))
    })
  }
}
