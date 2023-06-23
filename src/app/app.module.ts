import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {AngularFireModule} from '@angular/fire/compat'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponentComponent } from './header-component/header-component.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UploadComponent } from './upload/upload.component';
import { AuthComponent } from './auth/auth.component';
import { LogoComponent } from './logo/logo.component';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth/auth.service';
import { LoaderComponent } from './loader/loader.component';
import { OtherProfilesComponent } from './other-profiles/other-profiles.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent,
    HomeComponent,
    UserProfileComponent,
    UploadComponent,
    AuthComponent,
    LogoComponent,
    LoaderComponent,
    OtherProfilesComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AngularFireModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase)

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
