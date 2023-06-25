import {
  Component,
  ComponentFactoryResolver,
  Injectable,
  ViewChild
} from '@angular/core'
import { NgForm } from '@angular/forms'
import { tap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { AuthService } from './auth.service'
import { PlaceHolderDirective } from '../place-holder.directive'
import { AlertComponent } from '../alert/alert.component'
import { Subscription } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  @ViewChild(PlaceHolderDirective, { static: false })
  alertHost: PlaceHolderDirective
  isLoginMode = true
  name = ''
  email = ''
  constructor (
    private auth: AuthService,
    private router: Router,
    private componentFactoryRes: ComponentFactoryResolver
  ) {}

  onSignup () {
    this.isLoginMode = !this.isLoginMode
  }
  error:string = null
  onSubmit (form: NgForm) {
    const email = form.value.email
    const password = form.value.password
    const name = form.value.name
    const userData = { email, name }

    if (this.isLoginMode) {
      this.auth
        .login(email, password)
        .pipe(
          tap(() => {
            this.auth.getUser(email).subscribe(user => {
              if (user.length > 0) {
                this.name = user[0].name
                this.router.navigate(['/home'])
              }
            })
            // this.router.navigate(['/user-profile']);
          })
        )
        .subscribe(
          res => {},
          errorMessage => {
            this.error = errorMessage
            this.showErrorAlert(errorMessage)
          }
        )
    } else {
      this.auth
        .signup(email, password)
        .pipe(
          tap(() => {
            this.auth.storeUser(userData).then(() => {
              // this.router.navigate(['/user-profile']);
            })
          })
        )
        .subscribe(
          res => {},
          errorMessage => {
            this.error = errorMessage
            this.showErrorAlert(errorMessage)
          }
        )
    }
  }
  reset = false
  toReset () {
    this.reset = !this.reset
  }
  resetPassword (form: NgForm) {
    this.auth.resetPassword(form.value.email)
    this.reset = false
  }
  closeSub:Subscription
  private showErrorAlert (message: string) {
    const alertCompFactory =
      this.componentFactoryRes.resolveComponentFactory(AlertComponent)
    const hostViewContainerRef = this.alertHost.viewContainerRef
    hostViewContainerRef.clear()
    const componentRef = hostViewContainerRef.createComponent(alertCompFactory)
    componentRef.instance.message = message
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe()
      // this.alertHost.viewContainerRef.clear()
      hostViewContainerRef.clear()
    })
  }
}
