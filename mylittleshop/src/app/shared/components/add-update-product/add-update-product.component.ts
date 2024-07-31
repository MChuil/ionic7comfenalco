import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/iuser';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  public productForm = new FormGroup({
    'id': new FormControl(''),
    'image' : new FormControl(null,[Validators.required]),
    'name' : new FormControl(null,[Validators.required, Validators.minLength(4)]),
    'price' : new FormControl(null,[Validators.required, Validators.min(0)]),
    'totalUnits': new FormControl(null,[Validators.required, Validators.min(0)]),
  })    

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private loadingService: LoadingService, private toastService: ToastService, private router: Router, private storageService: StorageService) {
 
  }

  ngOnInit() {
  }

  async register(){
    const loading = await this.loadingService.loading('Creando cuenta...');
    await loading.present();
    //creación de cuenta
    this.firebaseService.signUp(this.productForm.value as IUser)
    .then(async(resp) => {
      //actualizo el nombre
      await this.firebaseService.updateUser(this.productForm.value.name)

      //obtener el uid
      let uid = resp.user.uid;
    }).catch(error => {
      console.log(error)
      this.toastService.presentToast(error.message, 'danger')
    }).finally(()=>{
      loading.dismiss();
    })
  }
}
