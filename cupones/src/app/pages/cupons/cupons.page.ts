import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Cupon } from 'src/app/models/cupon';
import { CuponsService } from 'src/app/services/cupons.service';

@Component({
  selector: 'app-cupons',
  templateUrl: './cupons.page.html',
  styleUrls: ['./cupons.page.scss'],
})
export class CuponsPage implements OnInit {

  public cupons: Cupon[];
  public cuponsActive: boolean = false;
  public showCamera: boolean;

  constructor(private cuponService: CuponsService, private navParams: NavParams, private navCtrl: NavController) {
    this.cupons = [];
    this.showCamera = false;
  }

  async ngOnInit() {
    this.cupons = await this.cuponService.getCupons();
  }

  changeActive(cupon: Cupon){
    cupon.active = !cupon.active
    this.cuponsActive = this.cupons.some(c => c.active)
  }

  goToCard(){
    this.navParams.data['cupons'] = this.cupons.filter(c => c.active)
    this.navCtrl.navigateForward('card')
  }

  startCamera(){
    this.showCamera = true;
  }

  closeCamera(){
    this.showCamera = false;
  }

}
