import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Producto } from 'src/app/models/product.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  isModalOpen = false;
  countClicks = 1;

  addFields(){
    if(this.countClicks == 2){
      this.utilsSvc.presentToast({
        message: 'Solo puedes agregar 2 comentarios',
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 1500
      });
    } else{
      this.countClicks += 1;
      var container = document.getElementById("comentarios");
      let clone = container.cloneNode(true);
      container.appendChild(clone);
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.countClicks = 1;
  }

  @Input() product: Producto;
  user  = {} as User;

  formProduct = new FormGroup({
    id: new FormControl(''),
    titulo: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    comentarios: new FormControl([], [Validators.required, Validators.minLength(1), Validators.maxLength(35)])
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

  async createProduct(){
    let path = `users/${this.user.uid}`

    this.utilsSvc.presentLoading();
    delete this.formProduct.value.id;

    let dataUrl = this.formProduct.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = (await this.firebaseSvc.uploadImage(imagePath, dataUrl));
    this.formProduct.controls.image.setValue(imageUrl);

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

  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture()).dataUrl;
    this.formProduct.controls.image.setValue(dataUrl);
  }

}
