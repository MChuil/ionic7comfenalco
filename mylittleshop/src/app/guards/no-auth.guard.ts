import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class noAuthGuard implements CanActivate{
  
  constructor(private fbS: FirebaseService, private router: Router) {}

  canActivate(): any {
    return new Promise((resolve) =>{
      this.fbS.getAuth().onAuthStateChanged(auth =>{
        if(!auth){ 
            resolve(true);
        }else{
            this.router.navigateByUrl('/home')
            resolve(false);
        }
      })
    })
  }
}
