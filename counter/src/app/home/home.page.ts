import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public showNumber: string;
  public counter: number;

  constructor() {
    this.showNumber = '00';
    this.counter = 0;
  }

  up(){
    this.counter++
    if(this.counter < 10){
      this.showNumber = `0${this.counter}`
    }else{
      this.showNumber = ''+this.counter
    }

    //TODO: que solo permita llegar a 99
  }

  down(){
    this.counter--
    if(this.counter < 10){
      this.showNumber = `0${this.counter}`
    }else{
      this.showNumber = ''+this.counter
    }

    //TODO: que no baje de cero
  }

}
