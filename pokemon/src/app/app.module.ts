import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { UpperCasePipe } from '@angular/common';
import { MayusculaPipe } from './pipes/mayuscula.pipe';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, UpperCasePipe, MayusculaPipe],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    NavParams, 
    ScreenOrientation
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
