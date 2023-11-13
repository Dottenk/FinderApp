import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { User } from '../models/user.models';
import { getAuth,signInWithEmailAndPassword, updateProfile, createUserWithEmailAndPassword } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { addDoc, collection } from '@angular/fire/firestore'
import { getFirestore } from 'firebase/firestore';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilsSvc: UtilsService
  ) { }

  // Autenticación

  //acceder
  login(user: User) {
    return signInWithEmailAndPassword(getAuth(),user.email, user.password);
    
  }
//crear usuario
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(),user.email, user.password);
  }
//actualizar usuario
  updateUser(displayName){
    
    return updateProfile(getAuth().currentUser, {displayName});
  }

  getAuthState() {
    return this.auth.authState;
  }

  async signOut() {
    await this.auth.signOut();
    this.utilsSvc.routerLink('/login');
    this.utilsSvc.removeElementInLocalStorage('user');
  }

  // Firebase (base de datos)
  getSubcollection(path: string, subcollectionName: string) {
    return this.db.doc(path).collection(subcollectionName).valueChanges({idField: 'id'});
  }

  addToSubcollection(path: string, subcollectionName: string, object: any) {
    return this.db.doc(path).collection(subcollectionName).add(object)
  }

  updateDocument(path: string, object: any){
    return this.db.doc(path).update(object);
  }

  deleteDocument(path: string){
    return this.db.doc(path).delete();
  }

  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path), data);
  }

  uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path));
    })
  }
}
