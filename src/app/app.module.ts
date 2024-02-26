import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { AngularFireModule } from '@angular/fire/compat'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderComponentComponent } from './header-component/header-component.component'
import { HomeComponent } from './home/home.component'
import { UserProfileComponent } from './user-profile/user-profile.component'
import { UploadComponent } from './upload/upload.component'
import { AuthComponent } from './auth/auth.component'
import { LogoComponent } from './Funcs/logo/logo.component'
import { HttpClientModule } from '@angular/common/http'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { environment } from '../environments/environment'
import { provideAuth, getAuth } from '@angular/fire/auth'
import { provideFirestore, getFirestore } from '@angular/fire/firestore'
import { LoaderComponent } from './Funcs/loader/loader.component'

import { OtherProfilesComponent } from './other-profiles/other-profiles.component'
import { TitleCasePipe } from '@angular/common'
import { NgbdToastGlobal } from './components/toast/toast.component'
import { ToastsContainer } from './components/toast-container'
import { AngularCropperjsModule } from 'angular-cropperjs'
import { SuperImageCropper } from 'super-image-cropper'
import { AngularCropperComponent } from './angular-cropper/angular-cropper.component'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'

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
    OtherProfilesComponent,
    AngularCropperComponent
  ],
  providers: [TitleCasePipe],
  bootstrap: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AngularFireModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    NgbdToastGlobal,
    ToastsContainer,
    AngularCropperjsModule,
    NgbTooltipModule
  ]
})
export class AppModule {}
