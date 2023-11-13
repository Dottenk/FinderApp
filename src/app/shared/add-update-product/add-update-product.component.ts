import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild ("comentario1") Comentario1: ElementRef;
  @Input() product: Producto;
  user  = {} as User;
  isModalOpen = false;
  countClicks = 1;
  inputField: any[] = [];

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

  addFields(){
    if(this.countClicks == 2){
      this.utilsSvc.presentToast({
        message: 'Solo puedes agregar 2 comentarios',
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 1500
      });
    } else{
      var container = document.getElementById("container");
      var comment = document.getElementById(`comentario-${this.countClicks}`);
      let clone = comment.cloneNode(true);
      container.appendChild(clone);
      this.countClicks ++;
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.countClicks = 1;
  }

  formProduct = new FormGroup({
    id: new FormControl(''),
    titulo: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    comentarios: new FormControl([], [Validators.required, Validators.minLength(1),
     Validators.maxLength(35)]),
    date: new FormControl(),
    estado: new FormControl(),
  });


  async createProduct(){
    let path = `users/${this.user.uid}`

    this.utilsSvc.presentLoading();
    delete this.formProduct.value.id;

    let dataUrl = this.formProduct.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = (await this.firebaseSvc.uploadImage(imagePath, dataUrl));
    this.formProduct.controls.image.setValue(imageUrl);
    this.formProduct.controls.date.setValue(Date.now());
    this.formProduct.controls.estado.setValue('anunciado');

    for (let i = 1; i <= this.countClicks; i++) {
      let element = document.getElementById(`comentario-${i}`)  as HTMLInputElement;
      let string = element.textContent;
      string = string.slice(13);
      this.inputField.push(string);
    }

    this.formProduct.controls.comentarios.setValue(this.inputField);

    delete this.formProduct.value.id;

    this.firebaseSvc.addToSubcollection(path, 'productos', this.formProduct.value).then(() => {
      this.utilsSvc.dismssModal({success: true});
      this.utilsSvc.presentToast({
        message: 'Producto creado correctamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });

      this.utilsSvc.dismissLoading();
      this.isModalOpen = false;

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
        this.createProduct();
      }
    }


  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture()).dataUrl;
    this.formProduct.controls.image.setValue(dataUrl);
  }

}
