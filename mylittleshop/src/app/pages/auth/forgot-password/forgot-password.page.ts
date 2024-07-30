import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/iuser';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { sendPasswordResetEmail } from 'firebase/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  public loginForm = new FormGroup({
    'email' : new FormControl(null,[Validators.required, Validators.email])
  })    

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private loadingService: LoadingService, private toastService: ToastService, private storageService: StorageService, private router: Router) {
 
  }

  ngOnInit() {
  }

  async recovery(){
    const loading = await this.loadingService.loading('Espere...');
    await loading.present();
    this.firebaseService.recoveryByEmail(this.loginForm.value.email)
    .then(resp => {
      console.log(resp);
      //TODO: verificar respuesta de firebase 
      this.toastService.presentToast('Correo enviado con exito', 'success', 'mail-outline')
      this.router.navigateByUrl('/auth');
      this.loginForm.reset();
    }).catch(error => {
      console.log(error)
      this.toastService.presentToast(error.message, 'danger')
    }).finally(()=>{
      loading.dismiss();
    })
  }

}
