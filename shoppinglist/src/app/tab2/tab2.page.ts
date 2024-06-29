import { Component } from '@angular/core';
import { ShoppingItemService } from '../services/shopping-item.service';
import { AlertController} from '@ionic/angular'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public item: string;
  alertButtons = ['Aceptar', 'Cancelar'];

  constructor(private shoppingService: ShoppingItemService, private alertCtrl: AlertController) {}


  async addItem(){
    console.log(this.item)
    if(this.shoppingService.existsItem(this.item)){ //si existe
      const alerta = await this.alertCtrl.create({
        header: 'Atención',
        subHeader: 'Elemento duplicado',
        message: 'Este elemento ya existe, no se puede agregar. Favor de cambialo',
        buttons:  ['OK']
      })
      await alerta.present()
    }else{ //no existe
      this.shoppingService.addItem(this.item);
      this.item = '';
      console.log(this.shoppingService.items)
      //TODO: agregar un alerta que indique que el elemento se agrego
    }
  }


  // async mostrarAlerta(){
  //   const alerta = await this.alertCtrl.create({
  //     header: 'Atención',
  //     subHeader: 'Elemento duplicado',
  //     message: 'Este elemento ya existe, no se puede agregar. Favor de cambialo',
  //     buttons:  ['OK']
  //   })
  //   await alerta.present()
  // }

}
