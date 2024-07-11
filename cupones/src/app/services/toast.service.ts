import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) { }

  async presentToast(message: string, position: "top") {
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration: 1500,
    });

    await toast.present();
  }
}
