import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

export const tmpGuard: CanActivateFn = (route, state) => {
  const fbS = inject(FirebaseService)
  const router = inject(Router);
  return new Promise((resolve) =>{
    fbS.getAuth().onAuthStateChanged(auth =>{
      if(!auth){ 
          resolve(true);
      }else{
          router.navigateByUrl('/home')
          resolve(false);
      }
    })
  })
};
