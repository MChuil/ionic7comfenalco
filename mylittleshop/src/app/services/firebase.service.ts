import { Injectable } from '@angular/core';
import { AngularFireAuth }  from "@angular/fire/compat/auth"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth: AngularFireAuth) { }

  //Autenticación-------------------------------
}
