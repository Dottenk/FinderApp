import { Component } from '@angular/core';
import { Product } from 'src/app/models/product.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/add-update-product/add-update-product.component';

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
  loading: boolean = false;
  products: Product[]=[];

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }
  status(): boolean {
    return this.products && this.products.length > 0;
  }


  ionViewWillEnter(){
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 2000);
  }
//obtener productos
getProducts(){

  let path = `users/${this.user().uid}/products`;

  let sub = this.firebaseSvc.getCollectionData(path).subscribe({
    next: (res: any) => {
      console.log(res);
      this.products = res;
      sub.unsubscribe();
    }
  })
}
//agregar o actualizar un productos
addUpdateProduct(product?:Product){
  this.utilsSvc.presentModal({
    component: AddUpdateProductComponent,
    componentProps: {product}
  })

}
async confirmDeleteProduct(product: Product) {
  this.utilsSvc.presentAlert({
    header: 'Eliminar Objeto',
    message: '¿Estás seguro de eliminar este producto?',
    mode: 'ios',
    buttons: [
      {
        text: 'Cancelar',
      },
      {
        text: 'Si, eliminar',
        handler: () => this.deleteProduct(product),
      },
    ],
  });
}
//eliminar producto
async deleteProduct(product: Product) {
  let path = `users/${this.user().uid}/products/${product.id}`;

  const loading = await this.utilsSvc.presentLoading();
  await loading.present();

  try {
    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    await this.firebaseSvc.deleteDocument(path);

    this.products = this.products.filter((p) => p.id !== product.id);

    this.utilsSvc.presentToast({
      message: 'Objeto eliminado correctamente',
      duration: 2800,
      color: 'danger',
      position: 'middle',
      icon: 'checkmark-circle-outline',
    });
  } catch (error) {
    console.error(error);

    this.utilsSvc.presentToast({
      message: error.message,
      duration: 2800,
      color: 'primary',
      position: 'middle',
      icon: 'alert-circle-outline',
    });
  } finally {
    loading.dismiss();
  }
}
}