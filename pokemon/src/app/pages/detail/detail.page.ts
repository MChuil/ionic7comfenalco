import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Pokemon } from 'src/app/model/pokemon';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  public pokemon: Pokemon;
  public today = new Date();
  public users = [
    'miguel',
    'jhoan',
    'sandra',
    'camilo'
  ];

  constructor(private navParams: NavParams, private navCtrl: NavController) { 
    this.pokemon = this.navParams.data['pokemon'];
  }

  ngOnInit() {
    console.log(this.pokemon)
  }


  goBack(){
    this.navCtrl.pop();
  }
}
