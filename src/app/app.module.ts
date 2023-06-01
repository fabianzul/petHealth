import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module'

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { NgxGaugeModule } from 'ngx-gauge';
import {ConnectionService} from 'ng-connection-service';

import { SevenSegModule } from 'ng-sevenseg';
import { DeviceDetectorModule } from 'ngx-device-detector';

//components
import { NavPageComponent } from './components/nav-page/nav-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { VisorPageComponent } from './components/visor-page/visor-page.component';

//services
import {AuthService} from './services/auth.service';

//guards
import { AuthGuard } from './guards/auth.guard';


//firebase
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { AsyncPipe, DatePipe } from '../../node_modules/@angular/common';
import { environment } from 'src/environments/environment';
import { MatPaginatorIntl } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    NavPageComponent,
    LoginPageComponent,
    HomePageComponent,
    DashboardPageComponent,
    VisorPageComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    NgxGaugeModule,
    SevenSegModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    DeviceDetectorModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
    AuthService,
    AuthGuard,
    AsyncPipe,
    DatePipe,
    { provide: FirestoreSettingsToken, useValue: {}}
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
