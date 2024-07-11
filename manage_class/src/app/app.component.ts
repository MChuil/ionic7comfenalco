import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isWeb: boolean;

  constructor(private platform: Platform) {
    this.isWeb = false;
  }

  initApp(){
    this.platform.ready().then( async ()=>{
      const info  = await Device.getInfo();
      this.isWeb = info.platform == 'web'
    })
  }
}
