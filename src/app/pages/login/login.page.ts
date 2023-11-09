import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  onSubmit(){
    if(this.form.valid){
      this.utilsSvc.presentLoading({message: 'Autenticando...', mode: 'ios',duration: 2000});
      this.firebaseSvc.login(this.form.value as User).then(async res => {
        console.log(res);
        let user: User = {
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email
        }

        this.utilsSvc.setElementInLocalStorage('user', user);
        this.utilsSvc.routerLink('/home');
        this.utilsSvc.dismissLoading();

        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: 'success',
          icon: 'person-outline',
          mode: 'ios'
        });
        this.form.reset();
      }, error => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 5000,
          color: 'warning',
          icon: 'alert-circle-outline'
        });
        this.utilsSvc.dismissLoading();
      });
    }
  }




}
