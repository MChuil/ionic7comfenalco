import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student';
import { Statement } from '@angular/compiler';
import { Classes } from '../models/classes';
import { Filter } from '../models/filter';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class SqliteManagerService {

  private isWeb: boolean;
  private DB_SETUP_KEY = 'first_db_setup';
  private DB_NAME_KEY = 'db_name';
  private dbName: string;
  public dbReady: BehaviorSubject<boolean>;

  constructor(private alertCtrl: AlertController, private http: HttpClient) { 
    this.isWeb = false;
    this.dbName = '';
    this.dbReady = new BehaviorSubject(false); 
  }

  //inicializar la base de datos
  async init(){
    const info = await Device.getInfo();  //obtener la información del dispositivo
    const sqlite = CapacitorSQLite as any;

    if(info.platform == 'android'){
      try {
          await sqlite.requestPermission();
      } catch (error) {
        const alert = await this.alertCtrl.create({
          header: 'Atención',
          message: 'Se necesita el acceso a la base de datos de forma obligatoria',
          buttons:['OK']
        });
        await alert.present();
      }
    }else if(info.platform == 'web'){ //web
      this.isWeb = true;
      await sqlite.initWebStore();
    }
    this.setupDataBase()
  }


  async setupDataBase(){
      const dbSetupDone = await Preferences.get({key: this.DB_SETUP_KEY })
      if(!dbSetupDone.value){
        this.downloadDataBase(); //descargamos la DB
      }else{ //cargar la DB
        const db = await this.getDbName();
        await CapacitorSQLite.createConnection({database: db}); //conectamos a DB
        await CapacitorSQLite.open({database: db}) // abrir la DB
        this.dbReady.next(true);
      }
  }


  downloadDataBase(){
    this.http.get('assets/db/db.json').subscribe(async (jsonExport: JsonSQLite) => {
      const jsonString = JSON.stringify(jsonExport)
      const isValid = await CapacitorSQLite.isJsonValid({jsonstring: jsonString})
      if(isValid.result){
        this.dbName = jsonExport.database;
        await CapacitorSQLite.importFromJson({jsonstring: jsonString}); //se importa la DB
        await CapacitorSQLite.createConnection({database: this.dbName}); //conectamos a DB
        await CapacitorSQLite.open({database: this.dbName}) // abrir la DB

        await Preferences.set({key: this.DB_SETUP_KEY, value: '1' });
        await Preferences.set({key: this.DB_NAME_KEY, value: this.dbName });
        this.dbReady.next(true);
      }
    })
  }

  async getDbName(){
    if(!this.dbName){
      const db = await Preferences.get({key: this.DB_NAME_KEY});
      this.dbName = db.value;
    }
    return this.dbName;
  }

  async getStudents(search?: string){
    let sql = "SELECT * FROM students WHERE active = 1";
    if(search){
      sql += ` and (upper(name) like '%${search.toLocaleUpperCase()}%' or upper(surname) like '%${search.toLocaleUpperCase()}%')`
    }

    const db = await this.getDbName();
    return CapacitorSQLite.query({
      database: db,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues)=>{
      let students: Student[] = [];
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let student = row as Student;
        students.push(student);
      }
      return Promise.resolve(students);
    }).catch(error => Promise.reject(error))
  }


  async createStudent(student: Student){
    let sql = 'INSERT INTO students (name, surname, email, phone) VALUES (?, ?, ?, ?)';
    const db = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database : db,
      set: [
        {
          statement: sql,
          values: [
            student.name,
            student.surname,
            student.email,
            student.phone
          ]
        }
      ]
    }).then((changes: capSQLiteChanges)=>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: db})
      }
      return changes;
    })
  }

  async updateStudent(student: Student){
    let sql = 'UPDATE students SET name=?, surname=?, email=?, phone=? WHERE id=?'
    const db = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database : db,
      set:[
        {
          statement: sql,
          values: [
            student.name, 
            student.surname,
            student.email,
            student.phone,
            student.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges)=>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: db})
      }
      return changes;
    })

  }

  async deleteStudent(student: Student){
    let sql = 'UPDATE students SET active = 0 WHERE id = ?'
    const db = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: db,
      set: [
        {
          statement: sql,
          values: [
            student.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges)=>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: db})
      }
      return changes;
    })
  }

  // CLASES -------------------------------------------

  async getClasses(filter?: Filter){
    let  sql = 'SELECT * FROM class WHERE active = 1';
    if(filter){
      //inicio, fin, id_estudiante
      if(filter.date_start){
        sql += ` AND date_start >= '${filter.date_start}'`
      }

      if(filter.date_end){
        sql += ` AND date_end <= '${filter.date_end}'`
      }

      if(filter.id_student){
        sql += ` AND id_student = '${filter.id_student}'`
      }

    }

    const db = await this.getDbName();
    return CapacitorSQLite.query({
      database: db,
      statement: sql,
      values: []
    }).then((response:  capSQLiteValues)=>{
      let classes: Classes[] = [];
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        const c: Classes = row as Classes
        classes.push(c)
      }
      return Promise.resolve(classes);
    }).catch(error => Promise.reject(error))
  }
  

  async createClass(classe: Classes){
    let sql= 'INSERT INTO class (date_start, date_end, id_student, price) VALUES (?, ?, ?, ?)'
    const db = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: db,
      set:[
        {
          statement: sql,
          values: [
            classe.date_start,
            classe.date_end,
            classe.id_student,
            classe.price
          ]
        }
      ]
    }).then((changes: capSQLiteChanges)=>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: db})
      }
      return changes;
    })
  }

  async updateClass(classe: Classes){
    let sql = 'UPDATE class SET date_start = ?, date_end = ?, id_student = ?, price=? WHERE id = ?'
    const db = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: db,
      set: [
        {
          statement: sql,
          values:[
            classe.date_start,
            classe.date_end,
            classe.id_student,
            classe.price,
            classe.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges)=>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: db})
      }
      return changes;
    })
  }

  async deleteClass(classe: Classes){
    let sql = 'UPDATE class SET active = 0 WHERE id = ?'
    const db = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: db,
      set: [
        {
          statement: sql,
          values: [
            classe.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges)=>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: db})
      }
      return changes;
    })
  }

  async getPaymentByClass(id_class: number){
    let sql = 'SELECT * FROM payments WHERE id_class = ?'
    const db = await this.getDbName();
    return  CapacitorSQLite.query({
      database: db,
      statement: sql,
      values: [
        id_class
      ]
    }).then((response: capSQLiteValues)=>{
        let payment: Payment;
        if(response.values.length > 0){
          const row = response.values[0];
          payment =  row as Payment;
        }      
        return Promise.resolve(payment);
      }).catch(error => Promise.reject(error))
  }

  // PAGOS -------------------------------------------

  async getPayments(filter?: Filter){
    let sql = 'SELECT p.* FROM payments p, class c WHERE p.id_class = c.id AND c.active = 1';
    if(filter && filter.paid != null){
      if(filter.paid){
        sql += ' AND p.paid = 1';
      }else{
        sql += ' AND p.paid = 0';
      }
  
      if(filter.date_start){
        if(filter.paid){ //si busca los pagados
          sql += ` AND p.date >= '${filter.date_start}'` //se busca por la fecha en que se pago
        }else{ //si no busca los pagados
          sql += ` AND c.date_star >= '${filter.date_start}`
        }
      }
      
      if(filter.date_end){
        if(filter.paid){ //si busca los pagados
          sql += ` AND p.date <= '${filter.date_end}'` //se busca por la fecha en que se pago
        }else{ //si no busca los pagados
          sql += ` AND c.date_end <= '${filter.date_end}`
        }
      }

      if(filter.id_student){
        sql += ` AND c.id_student = ${filter.id_student}`
      }
    }
    sql += ' ORDER BY p.date';

    const db = await this.getDbName();
    return CapacitorSQLite.query({
      database: db,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues) =>{
      let payments: Payment[] = [];
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let payment: Payment = row as Payment
        payments.push(payment)
      }
      return Promise.resolve(payments)
    }).catch(err => Promise.reject(err))
  }

  async createPayment(payment: Payment){
    let sql = 'INSERT INTO payments(date, id_class, paid) VALUES (?, ?, ?)'
    const db = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: db,
      set:[
        {
          statement: sql,
          values: [
            payment.date,
            payment.id_class,
            payment.paid
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) =>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({
          database: db
        })
      }
      return changes;
    })
  }

  async updatePayment(payment: Payment){
    let sql = 'UPDATE payments SET date= ?, id_class = ?, paid = ? WHERE id = ?'
    const db = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: db,
      set:[
        {
          statement: sql,
          values:[
            payment.date,
            payment.id_class,
            payment.paid,
            payment.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges)=>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: db})
      }
      return changes;
    })
  }

}