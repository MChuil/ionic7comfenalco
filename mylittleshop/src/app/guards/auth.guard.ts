import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGard implements CanActivate{

  constructor(private fbS: FirebaseService, private router: Router) {}

  canActivate(): any {
    let user = localStorage.getItem('user');
    return new Promise((resolve) =>{
      this.fbS.getAuth().onAuthStateChanged(auth =>{
        if(auth){ 
          if(user)
            resolve(true);
        }else{
          this.fbS.singOut()
          resolve(false);
        }
      })
    })
  }
}
