import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  
  const firebaseSvc = inject(FirebaseService);
  const router = inject(Router);
  
  let user = localStorage.getItem('user');
  
  return new Promise((resolve) =>{
    firebaseSvc.getAuth().onAuthStateChanged((auth)=>{
      if(auth){ 
        if(user)
          resolve(true);
      }else{
          router.navigateByUrl('/auth')
          resolve(false);
      }
    })
  })
};
