import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/interfaces/iproduct';
import { IUser } from 'src/app/interfaces/iuser';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalService } from 'src/app/services/modal.service';
import { StorageService } from 'src/app/services/storage.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public products: IProduct[] = [];

  constructor(private fbS: FirebaseService, private modalService: ModalService, private storage: StorageService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getProducts();
  }

  user(): IUser{
    return this.storage.get('user');
  }

  getProducts(){
    let path = `users/${this.user().uid}/products`
    let sub = this.fbS.getCollectionData(path).subscribe({
      next: (resp: any)=>{
        console.log(resp);
        this.products = resp;
        sub.unsubscribe();
      }
    })

  }

  singOut(){
    this.fbS.singOut();
  }
  
  addUpdateProduct(product?: IProduct){

    this.modalService.openModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    })
  }

}
