import { Component,  OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product.models';
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

  products: Product[] = [];
  productSelected: Product = {} as Product;
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
    return this.user = this.utilsSvc.getFromLocalStorage("user");
  }

  getProduct(){
    let user : User = this.utilsSvc.getFromLocalStorage("user");
    let path = `users/${user.uid}`;

    let sub = this.firebaseSvc.getSubcollection(path, 'productos').subscribe({
      next: (res : Product[]) => {
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
      this.utilsSvc.dismissModal({success: true});
      this.utilsSvc.presentToast({
        message: 'Producto actualizado exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });

      this.utilsSvc.dismissLoading();
      this.getProduct();

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

  deleteProduct(product : Product){
    let path = `users/${this.user.uid}/productos/${product.id}`;

    this.utilsSvc.presentLoading();

    this.firebaseSvc.deleteDocument(path).then(res => {

    this.utilsSvc.presentToast({
      message: 'Producto eliminado exitosamente',
      color: 'success',
      icon: 'checkmark-circle-outline',
      duration: 1500
    });

    this.getProduct();
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

  confirmDeleteProduct(product: Product){ {
    this.utilsSvc.presentAlert({
      header: 'Eliminar producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }]
      });
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
