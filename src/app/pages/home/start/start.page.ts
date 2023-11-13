import { Component,  OnInit, ViewChild } from '@angular/core';
import { Producto } from 'src/app/models/product.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  productSelected: Producto = {} as Producto;
  user = {} as User;
  loading = true;
  lenght : any;
  isModalOpen = false;

  formSelectedProduct = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(4)]),
    comentarios: new FormControl([], [Validators.required, Validators.minLength(1), Validators.maxLength(35)]),
    date: new FormControl(0),
  });

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
          this.lenght = Array(res.length).fill(0);
          this.loading = false;
      }
    });
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  getSelectedProduct(uid: string){
    return this.productSelected = this.products.find(product => product.id === uid);
  }

  updateProduct(){
    let path = `users/${this.user.uid}/productos/${this.productSelected.id}`

    this.utilsSvc.presentLoading();

    this.firebaseSvc.updateDocument(path, this.formSelectedProduct.value).then(() => {
      this.utilsSvc.dismssModal({success: true});
      this.utilsSvc.presentToast({
        message: 'Producto actualizado exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });

      this.utilsSvc.dismissLoading();

    }, error => {
      this.utilsSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      });

      this.utilsSvc.dismissLoading();
    });
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
