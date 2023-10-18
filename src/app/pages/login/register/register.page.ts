import { async } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4), , Validators.maxLength(15)]),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl(['', Validators.required]),
    confirmPassword: new FormControl('')
  });

  constructor(
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
    this.confirmPasswordValidator();
  }

  confirmPasswordValidator(){
    this.registerForm.controls.confirmPassword.setValidators([
      Validators.required,
      CustomValidators.matchValues(this.registerForm.controls.password)
    ])
    this.registerForm.controls.confirmPassword.updateValueAndValidity();
  }

  onSubmit(){
    if(this.registerForm.valid){
      this.utilsSvc.presentLoading({message: 'Registrando...', mode: 'ios', duration: 2000});
      this.firebaseSvc.signUp(this.registerForm.value as User).then(async res => {
        console.log(res);
        await this.firebaseSvc.updateUser({displayName: this.registerForm.value.name})
        let user: User = {
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email,
        }

        this.utilsSvc.setElementInLocalStorage('user', user);
        this.utilsSvc.routerLink('/home');
        this.utilsSvc.dismissLoading();

        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: 'primary',
          icon: 'person-outline'
        });
        this.registerForm.reset();
      }, error => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: error,
          duration: 5000,
          color: 'warning',
          icon: 'alert-circle-outline'
        });
      });
    }
  }


}
