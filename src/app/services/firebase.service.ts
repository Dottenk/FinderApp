import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { User } from '../models/user.models';
import { getAuth,signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
  login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signUp(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  updateUser(user: any){
    const auth = getAuth();
    return updateProfile(auth.currentUser, user);
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
