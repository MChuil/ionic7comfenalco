import { Injectable } from '@angular/core';
import { CapacitorSQLite, JsonSQLite } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
}