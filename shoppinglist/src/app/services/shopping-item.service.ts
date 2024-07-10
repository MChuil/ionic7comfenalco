import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingItemService {

  public items : string[];
  public isEmpty: boolean;

  constructor() {
    this.items = [];
    this.isEmpty = true;
  }

  addItem(item: string){
    this.items.push(item);
    this.isEmpty = false;
  }

  removeItem(item: string){
    let index = this.items.findIndex(row => row === item);
    if(index != -1){ //si encontro el elemento
      this.items.splice(index, 1);
      this.isEmpty = (this.items.length == 0)? true: false;
    }
  }

  removeAllItems(){
    this.items = [];
    this.isEmpty = true;
  }

  existsItem(item: string){
    const itemFound = this.items.find(it => it.toLowerCase() === item.toLowerCase())
    return itemFound;
  }

}