import { Component, OnInit } from '@angular/core';
import { Classes } from 'src/app/models/classes';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  public  classes: Classes[];
  public showForm: boolean; 

  constructor( private sqliteService: SqliteManagerService) {
    this.showForm = false;
    this.classes = [];
  }

  ngOnInit(): void {
    this.getClasses();
    
  }

  getClasses(){
    Promise.all([
      this.sqliteService.getStudents(),
      this.sqliteService.getClasses()
    ]).then(results => {
      let students = results[0];
      this.classes = results[1];
      this.associate(students);
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

}
