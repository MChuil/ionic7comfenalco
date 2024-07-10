import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { QRCodeModule } from 'angularx-qrcode';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    QRCodeModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, NavParams],
  bootstrap: [AppComponent],
})
export class AppModule {}
