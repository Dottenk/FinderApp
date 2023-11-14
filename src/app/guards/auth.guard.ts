import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard{

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
  //     return this.firebaseSvc.getAuthState().pipe(map(auth => {
  //       // Existe usuario autenticado
  //       if(auth) {
  //         return true;
  //       } else {
  //         // No existe usuario autenticado
  //         this.utilsSvc.routerLink('presets/loader');
  //         return false;
  //       }
  //     }));
  // }

      let user = localStorage.getItem('user');

  return new Promise((resolve) => {
    
    this.firebaseSvc.getAuth().onAuthStateChanged((auth) =>{
      if (auth){
       if (user) resolve(true);
       }
       else{
        this.utilsSvc.routerLink('/login');
        resolve(false);
       }
    })
  })
}
}