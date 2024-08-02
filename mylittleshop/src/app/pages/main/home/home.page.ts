import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { IProduct } from 'src/app/interfaces/iproduct';
import { IUser } from 'src/app/interfaces/iuser';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalService } from 'src/app/services/modal.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { query, orderBy, where } from '@angular/fire/firestore'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public products: IProduct[] = [];
  loading: boolean = false;

  constructor(private fbS: FirebaseService, private modalService: ModalService, private storage: StorageService, private loadingService: LoadingService, private toastService: ToastService, private alertCtrl: AlertController) { }

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
    this.loading = true;

    let query = [
      orderBy('totalUnits', 'desc'),
      //where('totalUnits', '>', 25)
    ];
    
    
    let sub = this.fbS.getCollectionData(path, query).subscribe({
      next: (resp: any)=>{
        this.products = resp;
        this.loading = false;
        sub.unsubscribe();
      }
    })

  }

  doRefresh($event){
      this.getProducts()
      $event.target.complete()
  }

  //Total de ganancias
  getTotals(){
    return this.products.reduce((index, product)=> index + product.price * product.totalUnits, 0)
  }
  
  async addUpdateProduct(product?: IProduct){
    let success = await this.modalService.openModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    });

    if(success) this.getProducts();
  }

  async delete(product: IProduct){
    const loading = await this.loadingService.loading('Eliminando producto, espere...');
    await loading.present();

    let path = `users/${this.user().uid}/products/${product.uid}`
    
    //eliminar la imagen fisicamente
    let imagePath = await this.fbS.getFilePath(product.image); 
    await  this.fbS.deleteFile(imagePath);
    
    //eliminamos de la base de datos
    this.fbS.deleteDocument(path).then(res =>{
      this.toastService.presentToast('Producto eliminado correctamente', 'success', 'checkmark-circle-outline');
      
      this.products = this.products.filter(p => p.uid != product.uid)

    }).catch(err =>{
      console.log(err);
      this.toastService.presentToast(err.message, 'danger');
    }).finally(()=>{
      loading.dismiss();
    })
  }


  async presentAlert(product: IProduct) {
    const alert = await this.alertCtrl.create({
      header: '¿Esta seguro?',
      message: 'Se va a eliminar el producto',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger',
          handler: ()=>{
            console.log('cancelado....')
          }
        },
        {
          text: 'Si, eliminar',
          handler: ()=>{
              this.delete(product)
          }
        }
      ]
    });
  
    await alert.present();
  }

}
