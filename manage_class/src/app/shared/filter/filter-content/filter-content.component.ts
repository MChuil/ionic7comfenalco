import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Filter } from 'src/app/models/filter';
import { Student } from 'src/app/models/student';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-filter-content',
  templateUrl: './filter-content.component.html',
  styleUrls: ['./filter-content.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FilterContentComponent  implements OnInit {

  @Input() filter: Filter;
  @Input() payment: boolean;

  public students: Student[];

  constructor(private sqliteService: SqliteManagerService, private popoverCtrl: PopoverController) { 
    this.students = [];
  }

  ngOnInit() {
    this.sqliteService.getStudents().then((students: Student[]) =>{
      this.students = students;
    })
  }

  filterData(){
    this.popoverCtrl.dismiss(this.filter)
  }

  reset(){
    this.filter = new Filter();
    this.popoverCtrl.dismiss(this.filter)
  }

}
