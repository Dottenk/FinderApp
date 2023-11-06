import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/product.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
  }

  products: Producto[] = [];
  user = {} as User;
  
  ionViewWillEnter(){
    this.getUser();
    this.getProduct();
  }

  getUser(){
    return this.user = this.utilsSvc.getElementInLocalStorage("user");
  }

  getProduct(){
    let user : User = this.utilsSvc.getElementInLocalStorage("user");
    let path = `users/${user.uid}`;

    let sub = this.firebaseSvc.getSubcollection(path, 'productos').subscribe({
      next: (res : Producto[]) => {
          console.log(res);
          
          this.products = res;
          sub.unsubscribe();
      }
    });
  }
}
