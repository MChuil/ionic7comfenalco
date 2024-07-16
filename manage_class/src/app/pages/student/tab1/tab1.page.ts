import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/student';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public students: Student[];
  public showForm: boolean;

  public name: string;
  public surname: string;
  public email: string;
  public phone: string;

  constructor(private sqliteService: SqliteManagerService) {
    this.showForm = false;
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
    this.showForm = false;
  }

  searchStudent($event){
    console.log($event.detail.value)
    this.sqliteService.getStudents($event.detail.value).then((students: Student[])=>{
      this.students = students
    })
  }

  createUpdateStudent(){

  }

}
