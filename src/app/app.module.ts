import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot({mode: 'md'}),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,

  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {
}

const app = initializeApp(environment.firebase);
const storage = getStorage(app);
