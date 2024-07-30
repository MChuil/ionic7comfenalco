import { Injectable } from '@angular/core';
import { AngularFireAuth }  from "@angular/fire/compat/auth"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { IUser } from '../interfaces/iuser';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { getFirestore, setDoc, doc, getDoc} from '@angular/fire/firestore'
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) { }

  //----------------------------- Autenticación -------------------------------

  getAuth(){
    return getAuth();
  }

  //Acceder
  signIn(user: IUser){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }
  
  //crear cuenta
  signUp(user: IUser){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //actualizar usuario
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, { displayName })
  }

  recoveryByEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }


  //----------------------------- Base de datos -------------------------------

  // Setear un documento 
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}
