import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService,
  ) { }

  ngOnInit() {

  }

  async onSubmit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.presentLoading();
      await loading.present();

      this.firebaseSvc.login(this.form.value as User).then(async res => {


        console.log(res);

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
}