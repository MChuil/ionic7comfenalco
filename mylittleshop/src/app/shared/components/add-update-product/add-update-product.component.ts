import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/interfaces/iproduct';
import { IUser } from 'src/app/interfaces/iuser';
import { CameraService } from 'src/app/services/camera.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalService } from 'src/app/services/modal.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  @Input() product: IProduct;

  public productForm = new FormGroup({
    'uid': new FormControl(''),
    'image' : new FormControl(null,[Validators.required]),
    'name' : new FormControl(null,[Validators.required, Validators.minLength(4)]),
    'price' : new FormControl(null,[Validators.required, Validators.min(0)]),
    'totalUnits': new FormControl(null,[Validators.required, Validators.min(0)]),
  })    

  user = {} as IUser;

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private loadingService: LoadingService, private toastService: ToastService, private router: Router, private storageService: StorageService, private cameraService: CameraService, private modalService: ModalService) {
 
  }

  ngOnInit() {
    this.user = this.storageService.get('user');
    if(this.product) this.productForm.setValue(this.product)
  }


  // convierte de string a numeros
  setNumberInput(){
    let { price, totalUnits } = this.productForm.controls
    if(price.value) price.setValue(parseFloat(price.value)) 
    if(totalUnits.value) totalUnits.setValue(parseFloat(totalUnits.value)) 
  }
  submit(){
    if(!this.product){
      this.insert();
    }else{
      this.update();
    }
  }

  async insert(){
    const loading = await this.loadingService.loading('Almacenando producto, espere...');
    await loading.present();

    let path = `users/${this.user.uid}/products`

    // Subir la imagen y obtener la url
    let dataUrl = this.productForm.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`
    let imageUrl = await this.firebaseService.uploadImage(imagePath, dataUrl);

    this.productForm.controls.image.setValue(imageUrl)

    delete this.productForm.value.uid

    this.firebaseService.addDocument(path, this.productForm.value).then(res =>{
      this.toastService.presentToast('Producto agregado', 'success', 'checkmark-circle-outline');
      this.modalService.dismissModal({ success: true });
    }).catch(err =>{
      console.log(err);
      this.toastService.presentToast(err.message, 'danger');
    }).finally(()=>{
      loading.dismiss();
    })
   
  }
  
  async update(){
    const loading = await this.loadingService.loading('Actualizando producto, espere...');
    await loading.present();

    let path = `users/${this.user.uid}/products/${this.product.uid}`
    
    // Subir la imagen y obtener la url
    if(this.productForm.value.image !== this.product.image){
      let dataUrl = this.productForm.value.image;
      let imagePath = await this.firebaseService.getFilePath(this.product.image); 
      let imageUrl = await this.firebaseService.uploadImage(imagePath, dataUrl);
      this.productForm.controls.image.setValue(imageUrl)
    }

    delete this.productForm.value.uid

    this.firebaseService.updateDocument(path, this.productForm.value).then(res =>{
      this.toastService.presentToast('Producto actualizado correctamente', 'success', 'checkmark-circle-outline');
      this.modalService.dismissModal({ success: true });
    }).catch(err =>{
      console.log(err);
      this.toastService.presentToast(err.message, 'danger');
    }).finally(()=>{
      loading.dismiss();
    })
  }



  // Tomar la imagen----------------
  async takeImage(){
    const dataUrl = (await this.cameraService.takePicture()).dataUrl;
    this.productForm.controls.image.setValue(dataUrl);
  }

}
