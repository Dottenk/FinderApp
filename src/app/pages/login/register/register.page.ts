import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService,
  ) { }

  ngOnInit() {

  }

  async onSubmit(){
    if(this.form.valid){
const loading = await this.utilsSvc.presentLoading();
await loading.present();

        this.firebaseSvc.signUp(this.form.value as User).then( async res => {
       

       await this.firebaseSvc.updateUser(this.form.value.name);
       console.log(res);
             
        this.form.reset();
      }).catch( error => {
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




}
