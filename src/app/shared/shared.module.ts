import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { AddUpdateProductComponent } from './add-update-product/add-update-product.component';
import { LogoComponent } from './logo/logo.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    CustomInputComponent,
    AddUpdateProductComponent,
    HeaderComponent,
    LogoComponent,
    AddUpdateProductComponent
  ],
  exports: [
    CustomInputComponent,
    AddUpdateProductComponent,
    LogoComponent,
    HeaderComponent,
    AddUpdateProductComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
