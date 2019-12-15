import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeleccionarBoletoComponent } from './seleccionar-boleto/seleccionar-boleto.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AutobusComponent } from './autobus/autobus.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { NgxStripeModule } from 'ngx-stripe';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SeleccionarBoletoComponent,
    AutobusComponent,
    AdminComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    HttpClientModule,
    NgxStripeModule.forRoot('pk_test_Y0kZ5WPveVXszaykAlmz672S00ZX03BLoa'),
  ],
  providers: [AngularFirestore, HttpClientModule, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
