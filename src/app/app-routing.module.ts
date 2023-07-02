import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { UploadComponent } from './upload/upload.component'
import { AuthComponent } from './auth/auth.component'
import { AuthGuard } from './auth/auth.guard'
import { UserProfileComponent } from './user-profile/user-profile.component'
import { OtherProfilesComponent } from './other-profiles/other-profiles.component'

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: 'auth', component: AuthComponent },
  {
    path: 'user/:email',
    component: OtherProfilesComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
