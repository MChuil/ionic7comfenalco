import { Injectable } from '@angular/core';
import { AngularFireAuth }  from "@angular/fire/compat/auth"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { IUser } from '../interfaces/iuser';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query} from '@angular/fire/firestore'
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { getStorage, uploadString, ref, getDownloadURL} from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private storage: StorageService, private router: Router, private firebaseStorage: AngularFireStorage
  ) { }

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

  singOut(){
    getAuth().signOut();
    this.storage.remove('user');
    this.router.navigateByUrl('/auth')
  }


  //----------------------------- Base de datos -------------------------------

  //Obtener los documentos de una colección
  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery),{ idField: 'uid'});
  }

  // Setear un documento 
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //Almacenar en el documento
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path),data);
  }

  // Almacenamiento en el storage - subir imagen
  async uploadImage(path: string, dataUrl: string){
    return uploadString(ref(getStorage(), path), dataUrl, 'data_url').then(()=>{
      return getDownloadURL(ref(getStorage(), path))
    })
  }
}
