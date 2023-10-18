import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService
  )
  {}

  signOut(){
    this.firebaseSvc.signOut();
    this.utilsSvc.presentLoading({message: 'Cerrando sesion...', mode: 'ios', duration: 1000});
    this.utilsSvc.removeElementInLocalStorage('user');
    this.utilsSvc.routerLink('loader');
    this.utilsSvc.dismissLoading();
  }



}
