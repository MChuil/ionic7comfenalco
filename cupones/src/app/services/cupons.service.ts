import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CuponsService {

  constructor() { }

  getCupons(){
    return fetch('./assets/data/data.json')
      .then(r=>r.json())
      .then(data => {
        data.forEach( row => row.active = false);
        return data
      }).catch(err=>{
        console.log(err.toMessage());
      })
  }
}
