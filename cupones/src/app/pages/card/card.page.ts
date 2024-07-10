import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {

  public QrCode: string;

  constructor(private navParams: NavParams) {
    
  }

  ngOnInit() {
    this.QrCode = JSON.stringify(this.navParams.data['cupons'])
    console.log(this.QrCode)
  }

}
