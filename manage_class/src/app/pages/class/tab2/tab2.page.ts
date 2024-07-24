import { Component, OnInit } from '@angular/core';
import { Classes } from 'src/app/models/classes';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { Filter } from 'src/app/models/filter';

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

  public filter: Filter;


  constructor( private sqliteService: SqliteManagerService, private alertService: AlertService) {
    this.showForm = false;
    this.classes = [];
    this.filter = new Filter();
  }

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses(){
    Promise.all([
      this.sqliteService.getStudents(),
      this.sqliteService.getClasses(this.filter)
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
    this.objClass = null;
    this.showForm = false;
    this.getClasses();
  }


  updateClass(classe: Classes){
    this.objClass = classe;
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

  search($event: Filter){
    this.filter = $event;
    this.getClasses()
  }
}
