import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadigCtrl: LoadingController) { }

  loading(message: string){
    return this.loadigCtrl.create({
      spinner: 'crescent',
      message
    })
  }
}
