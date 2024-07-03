import { Component } from '@angular/core';
import { ShoppingItemService } from '../services/shopping-item.service';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public shoppingService: ShoppingItemService, 
    private alertCtrl: AlertController, private menuCtrl: MenuController) {}


  async removeItem(item: string){
    const alerta = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Esta seguro de eliminar el item?',
      buttons: [{
        text: 'Si',
        handler: ()=>{
          this.shoppingService.removeItem(item)
        }
      },
      {
        text: 'No',
        handler: ()=>{
          alerta.dismiss();
        }
      }]
    })
    await alerta.present()
  }


  // Eliminado = moviendo
  onReorderItem($event){
    const item = this.shoppingService.items.splice($event.detail.from, 1)[0]
    this.shoppingService.items.splice($event.detail.to, 0, item)
    $event.detail.complete()
  }


  async removeAll(){
    const alerta = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Esta seguro de eliminar TODO?',
      buttons: [{
        text: 'Si',
        handler: ()=>{
          this.shoppingService.removeAllItems()
          this.menuCtrl.close();
        }
      },
      {
        text: 'No',
        handler: ()=>{
          alerta.dismiss();
        }
      }]
    })
    await alerta.present()
  }
}
