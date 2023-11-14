import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {

  @Input() product: Product;



  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  user = {} as User;



  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required,]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    category: new FormControl('', [Validators.required]),
    status: new FormControl(false, [Validators.required]),
    site: new FormControl('', [Validators.required])

  });

  

  ngOnInit() {

    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product)
      this.product.status = this.product.status !== undefined ? this.product.status : false;
    this.form.setValue(this.product);
  }

//tomar foto con la camara
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit(){
    
  }
//crea producto
  async createProduct() {
    if (this.form.valid) {
      
    let path = `users/${this.user.uid}/products`
      
      const loading = await this.utilsSvc.presentLoading();
      await loading.present();

      //subir la imagen
      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
      delete this.form.value.id;


      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {  

        this.utilsSvc.dismissModal({ succes: true})
        
        this.utilsSvc.presentToast({
          message: 'Formulario creado exitosamente',
          duration: 5000,
          color: 'succes',
          icon: 'checkmark-circle-outline',
          position: 'middle'
        });

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 5000,
          color: 'warning',
          icon: 'alert-circle-outline',
          position: 'middle'
        });


      }).finally(() => {
        loading.dismiss();
      });
    }
  }
 
 

 //actualiza producto
  async updateProduct() {

    let path = `users/${this.user.uid}/products/${this.product.id}`

    const loading = await this.utilsSvc.presentLoading();
    await loading.present()


   //si cambio la imagen, la reemplaza por la nueva
   if (this.form.value.image !== this.product.image) {
     let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
     let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
     this.form.controls.image.setValue(imageUrl);
   }


     delete this.form.value.id;


     this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
       this.utilsSvc.dismissModal({ success: true });

    this.utilsSvc.presentToast({
         message: 'Objeto actualizado correctamente',
         duration: 2800,
       color: 'success',
         position: 'middle',
         icon: 'checkmark-circle-outline'
       })
       console.log(res);

       //control de error metodo catch
     }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
       message: error.message,
        duration: 2800,
        color: 'primary',
        position: 'middle',
       icon: 'alert-circle-outline'
       })
       //cierra el loading
     }).finally(() => {
      loading.dismiss();
    })
   }
}