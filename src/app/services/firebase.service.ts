import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { User } from '../models/user.models';
import {  getAuth ,signInWithEmailAndPassword, updateProfile, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, } from '@angular/fire/compat/firestore'
import { addDoc,doc,getDoc,query, collection, getFirestore, setDoc, collectionData, updateDoc,deleteDoc } from '@angular/fire/firestore'

import { getStorage, uploadString, ref, getDownloadURL,deleteObject } from 'firebase/storage'

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
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);

  }
  //crear usuario
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  //actualizar usuario
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }
  //enviar email para reestablecer contraseña
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }
//autenticacion
getAuth(){
  return getAuth();
}

//cerrar sesion
signOut(){
  getAuth().signOut();
  localStorage.removeItem('user')
  this.utilsSvc.routerLink('/login')
  }



  getSubcollection(path: string, subcollectionName: string) {
    return this.db.doc(path).collection(subcollectionName).valueChanges({ idField: 'id' });
  }

  addToSubcollection(path: string, subcollectionName: string, object: any) {
    return this.db.doc(path).collection(subcollectionName).add(object)

  }

  
  // Firebase (base de datos)
//obtener documentos de una coleccion
getCollectionData(path: string, collectionQuery?: any){
  const ref = collection(getFirestore(), path);
  return collectionData(query(ref,collectionQuery), {idField: 'id'})
}
  //actualizar documento
  updateDocument(path: string, data: any){
    return updateDoc(doc(getFirestore(), path), data);
  }
 //eliminar documento
 deleteDocument(path: string) {
  return deleteDoc(doc(getFirestore(), path));
}

//agregar objeto
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }
    //setear documento
    setDocument(path: string, data: any){
      return setDoc(doc(getFirestore(), path), data);
    }
    //obtener documento 
    async getDocument(path: string){
      return (await getDoc(doc(getFirestore(), path))).data();
    }

    //almacenamiento
//subir imagen
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path));
    })
  }

  //obtener ruta de la imagen
 async getFilePath(url: string){
    return ref(getStorage(), url).fullPath
  }
 // eliminar archivo
 deleteFile(path: string) {
  return deleteObject(ref(getStorage(), path));
    }
}
