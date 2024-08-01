import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import * as moment from 'moment';
import { Classes } from 'src/app/models/classes';
import { Student } from 'src/app/models/student';
import { Payment } from 'src/app/models/payment';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-form-class',
  templateUrl: './form-class.component.html',
  styleUrls: ['./form-class.component.scss'],
})
export class FormClassComponent  implements OnInit {

  @Input() objClass: Classes;
  
  @Output() close: EventEmitter<boolean>
  
  public payment: Payment;
  public paid: boolean;
  public alreadyPaid: boolean;
  public update: boolean;
  public students: Student[];

  constructor(private sqliteService: SqliteManagerService, private alertService:AlertService) { 
    this.update = false;
    this.close = new EventEmitter<boolean>();
  }

  ngOnInit() {
    if(!this.objClass){ 
      this.objClass = new Classes();
      this.objClass.price = 0;
      this.payment = new Payment();
      this.paid = false;
      this.alreadyPaid = false;
    }else{ //actualización
      this.update = true;
      this.sqliteService.getPaymentByClass(this.objClass.id).then((payment: Payment) =>{
        if(payment){
          this.payment = payment;
          this.alreadyPaid = (this.payment.paid == 1);
          this.paid = (this.payment.paid == 1);
        }else{
          this.paid = false;
          this.payment = new Payment();
        }
      })
    }
    
    this.sqliteService.getStudents().then((students: Student[])=>{
      this.students = students;
    })
  }

  createUpdateClass(){
    this.objClass.date_start = moment(this.objClass.date_start).format('YYYY-MM-DDTHH:mm')
    this.objClass.date_end = moment(this.objClass.date_end).format('YYYY-MM-DDTHH:mm')

    if(this.update){ //actualizar
      this.sqliteService.updateClass(this.objClass).then(()=>{
        if(this.paid){
          this.payment.paid = 1;
          this.payment.date = moment(this.payment.date).format('YYYY-MM-DDTHH:mm');
          this.sqliteService.updatePayment(this.payment);
        }


        this.alertService.alertMessage('Bien', 'Clase editada correctamente')
        this.onCloseForm();
      }).catch(err =>{
        this.alertService.alertMessage('Error', JSON.stringify(err))
      })
    }else{ //crear 
      this.sqliteService.createClass(this.objClass).then((changes: capSQLiteChanges) =>{
        this.payment.id_class = changes.changes.lastId;
        if(this.paid){
          this.payment.date = moment(this.payment.date).format('YYYY-MM-DDTHH:mm')
          this.payment.paid = 1;
        }else{
          this.payment.paid = 0;
        }
        this.sqliteService.createPayment(this.payment);

        this.alertService.alertMessage('Bien', 'Clase agregada correctamente')
        this.onCloseForm();
      }).catch(err =>{
        this.alertService.alertMessage('Error', JSON.stringify(err))
      })
    }
  }

  onCloseForm(){
    this.close.emit(true);
  }

}
