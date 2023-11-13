import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, AlertOptions, LoadingController, LoadingOptions, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }



  async takePicture () {
    return await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Selecciona en metodo para subir imagen',
      promptLabelPhoto: 'Elije una foto de tu Galeria',
      promptLabelPicture: 'Toma una foto',
    });

  }

  // Loading
  async presentLoading() {
    return this.loadingController.create({spinner: 'lines-sharp',message: 'Autenticando...', mode: 'ios',duration: 5000});
    
  }
//cierra el loading
  async dismissLoading() {
    return await this.loadingController.dismiss();
  }


  // LocalStorage
  setElementInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
//obtener objetos
  getElementInLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
//eliminar objeto
  removeElementInLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
//toast
  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  // Router
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // Alert
  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertController.create(opts);
    await alert.present();
  }

  // Modal Present
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();

    const {data} = await modal.onWillDismiss();

    if(data){
      return data;
    }
  }

  // Dismiss
  dismssModal(data?: any) {
    this.modalController.dismiss(data);
  }

}



