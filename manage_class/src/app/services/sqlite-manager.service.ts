import { Injectable } from '@angular/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SqliteManagerService {

  private isWeb: boolean;

  constructor(private alertCtrl: AlertController) { 
    this.isWeb = false;
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


  }
}