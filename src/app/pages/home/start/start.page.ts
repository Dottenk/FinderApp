import { Component,  OnInit } from '@angular/core';
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
  loading = true;
  lenght : any;
  background: string[]  = [];
  printed: boolean = false;

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
          this.getProductsBackground();
          sub.unsubscribe();
          this.lenght = Array(res.length).fill(0);
          this.loading = false;
      }
    });
  }

  getProductsBackground(){
    for (let producto of this.products) {
      if (producto.estado === 'anunciado') {
        this.background.push('warning');
      }if (producto.estado === 'custodiado') {
        this.background.push('primary');
      }if (producto.estado === 'entregado') {
        this.background.push('success');
      }
    }
    console.log(this.background);
  }

}
