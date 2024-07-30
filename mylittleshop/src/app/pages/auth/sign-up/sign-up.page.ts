import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/iuser';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  public loginForm = new FormGroup({
    'uid': new FormControl(''),
    'email' : new FormControl(null,[Validators.required, Validators.email]),
    'password': new FormControl(null,[Validators.required]),
    'name' : new FormControl(null,[Validators.required, Validators.minLength(4)])
  })    

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private loadingService: LoadingService, private toastService: ToastService, private router: Router, private storageService: StorageService) {
 
  }

  ngOnInit() {
  }

  async register(){
    const loading = await this.loadingService.loading('Creando cuenta...');
    await loading.present();
    //creación de cuenta
    this.firebaseService.signUp(this.loginForm.value as IUser)
    .then(async(resp) => {
      //actualizo el nombre
      await this.firebaseService.updateUser(this.loginForm.value.name)

      //obtener el uid
      let uid = resp.user.uid;
      this.loginForm.controls.uid.setValue(uid);

      //
      this.setUser(uid);
    }).catch(error => {
      console.log(error)
      this.toastService.presentToast(error.message, 'danger')
    }).finally(()=>{
      loading.dismiss();
    })
  }

  async setUser(uid: string){
    const loading = await this.loadingService.loading('Creando cuenta...');
    await loading.present();

    let path = `users/${uid}`
    delete this.loginForm.value.password
    
    this.firebaseService.setDocument(path, this.loginForm.value)
    .then(async(resp) => {
      //guardar en local los datos del usuario
      this.storageService.save('user', this.loginForm.value)
      //redireccionar
      this.router.navigateByUrl('home')
      this.loginForm.reset();

    }).catch(error => {
      console.log(error)
      this.toastService.presentToast(error.message, 'danger')
    }).finally(()=>{
      loading.dismiss();
    })
  }

}
