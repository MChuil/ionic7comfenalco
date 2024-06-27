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
    this.showNumber = '00'
    this.counter = 0
  }


  
  up(){
    
    this.counter++;
    
    if (this.counter < 10){
      this.showNumber = '0'+this.counter
    }else{
      this.showNumber = this.counter+''
    }
  }
  //Solo se permite llegar a máximo 99 y minimo 0

  down(){
    this.counter--
    if(this.counter < 10){
      this.showNumber = '0'+this.counter
    }else{
      this.showNumber = this.counter+''
    }
  }

  

}
