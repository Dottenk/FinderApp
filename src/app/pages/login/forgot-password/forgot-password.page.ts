import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';




@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
   
  });

  constructor(
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService,
  ) { }

  ngOnInit() {

  }
//metodo enviar
async submit() {
  if (this.form.valid){

    const loading = await this.utilsSvc.presentLoading();
    await loading.present()

    this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res => {

      this.utilsSvc.presentToast({
        message: 'Correo de recuperacion enviado con exito',
        duration: 3800,
        color: 'primary',
        position: 'middle',
        icon: 'mail-outline'
      })
      this.utilsSvc.routerLink('/login');
      this.form.reset();
//control 
    }).catch(error =>{
      console.log(error);

     this.utilsSvc.presentToast({
        message: error.message,
        duration: 3800,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
      //cierra el loading
    } ).finally(() => {
      loading.dismiss();
    })
  }
}

}
