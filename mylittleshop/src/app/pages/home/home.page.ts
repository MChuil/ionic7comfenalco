import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalService } from 'src/app/services/modal.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private fbS: FirebaseService, private modalService: ModalService) { }

  ngOnInit() {
  }

  singOut(){
    this.fbS.singOut();
  }

  addUpdateProduct(){
    this.modalService.openModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal'
    })
  }

}
