import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { User } from 'firebase/auth';
import { Producto } from 'src/app/models/product.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  @Input() product: Producto;
  user  = {} as User;

  formProduct = new FormGroup({
    id: new FormControl(''),
    titulo: new FormControl('', [Validators.required, Validators.minLength(4)]),
    comentarios: new FormControl([], [Validators.required, Validators.minLength(1)])
  })

  constructor(
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit(){
    this.user = this.utilsSvc.getElementInLocalStorage('user');

    if(this.product){
      this.formProduct.setValue(this.product);
      this.formProduct.updateValueAndValidity();
    }
  }

  createProduct(){
    let path = `users/${this.user.uid}`

    this.utilsSvc.presentLoading();
    delete this.formProduct.value.id;

    this.firebaseSvc.addToSubcollection(path, 'productos', this.formProduct.value).then(res => {
      this.utilsSvc.dismssModal({success: true});
      this.utilsSvc.presentToast({
        message: 'Producto creado correctamente',
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


  updateProduct(){
    let path = `users/${this.user.uid}/productos/${this.product.id}`

    this.utilsSvc.presentLoading();
    delete this.formProduct.value.id;

    this.firebaseSvc.updateDocument(path, this.formProduct.value).then(res => {
      this.utilsSvc.dismssModal({success: true});
      this.utilsSvc.presentToast({
        message: 'Producto actualizado exitonzamente',
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

  onSubmit(){
    if(this.formProduct.valid){
      if(this.product){
        this.updateProduct();
      }else{
        this.createProduct();
      }
    }
  }

}
