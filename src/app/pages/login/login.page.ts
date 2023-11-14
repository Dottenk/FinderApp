import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.models';
import { userInfo } from 'os';

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

      this.firebaseSvc.signIn(this.form.value as User).then(async res => {


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

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.presentLoading();
      await loading.present();

      let path = `users/${uid}`;
     

      this.firebaseSvc.getDocument(path).then((user: User)  => {

        this.utilsSvc.saveInLocalStorage('user', user.name);
        this.utilsSvc.routerLink('/main/home');
        this.form.reset();

        this.utilsSvc.presentToast({
          message: `Te damos la Bienvenida ${user.name}` ,
          duration: 5000,
          color: 'primary',
          icon: 'alert-circle-outline',
          position: 'middle'
        });
       

      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 5000,
          color: 'primary',
          icon: 'alert-circle-outline',
          position: 'middle'
        });


      }).finally(() => {
        loading.dismiss();
      });
    }
  }
}
