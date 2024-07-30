import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/iuser';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  public loginForm = new FormGroup({
    'email' : new FormControl(null,[Validators.required, Validators.email]),
    'password': new FormControl(null,[Validators.required])
  })    

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private loadingService: LoadingService, private toastService: ToastService, private storageService: StorageService, private router: Router) {
 
  }

  ngOnInit() {
  }

  async login(){
    const loading = await this.loadingService.loading('Validando credenciales...');
    await loading.present();
    
    this.firebaseService.signIn(this.loginForm.value as IUser)
    .then(async(resp) => {
        await this.getUser(resp.user.uid)
    }).catch(error => {
      console.log(error)
      this.toastService.presentToast(error.message, 'danger')
    }).finally(()=>{
      loading.dismiss();
    })
  }


  async getUser(uid: string){
    const loading = await this.loadingService.loading('Validando credenciales...');
    await loading.present();

    let path = `users/${uid}`
    //obtener datos del usuario
    this.firebaseService.getDocument(path)
    .then((user: IUser )=> {
      //guardar en local los datos del usuario
      this.storageService.save('user', user)
      //redireccionamos a Home
      this.router.navigateByUrl('home')
      this.loginForm.reset();
      this.toastService.presentToast(`Bienvenido(a) ${user.name}`, 'primary', 'person-circle-outline')
    }).catch(error => {
      console.log(error)
      this.toastService.presentToast(error.message, 'danger')
    }).finally(()=>{
      loading.dismiss();
    })
  }

}
