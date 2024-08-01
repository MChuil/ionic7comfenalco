import { Component, OnInit } from '@angular/core';
import { Classes } from 'src/app/models/classes';
import { Payment } from 'src/app/models/payment';
import { Student } from 'src/app/models/student';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import { Filter } from '../../../models/filter';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  public payments: Payment[];
  public total: number;
  public filter: Filter;

  constructor(private sqliService: SqliteManagerService) {
    this.payments = [];
    this.total = 0;
    this.filter = new Filter();
    this.filter.paid = null;
  }

  ngOnInit() {
    this.getPayments();
  }

  ionViewWillEnter(){
    this.getPayments();
  }

  async getPayments(){
    Promise.all([
      this.sqliService.getPayments(this.filter),
      this.sqliService.getClasses(),
      this.sqliService.getStudents()
    ]).then( (results)=>{
      this.payments = results[0];
      let classes = results[1];
      let students = results[2];
      this.associateObjects(classes, students);
      this.total = 0;
      this.calculateTotal();
    })
  }


  associateObjects(classes: Classes[], students: Student[]){
    this.payments.forEach( pay =>{
      pay.class = classes.find(c => c.id == pay.id_class)
      if(pay.class){
        pay.class.student = students.find( s => s.id == pay.class.id_student)
      }
    })
  }

  calculateTotal(){
    this.payments.forEach( p => {
        this.total += p.class.price
    })
    // TODO: Crear la suma con reduce
    console.log(this.total)
  }

  search($event: Filter){
    this.filter = $event;
    this.getPayments();
  }
}
