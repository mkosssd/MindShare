import { Component, Injectable, OnDestroy } from '@angular/core'
import { NgForm } from '@angular/forms'
import { tap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { AuthService } from './auth.service'
import { Subscription } from 'rxjs'
import { Meta, Title } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true
  name = ''
  email = ''
  constructor (
    private auth: AuthService,
    private router: Router,
    private metaService: Meta,
    private title: Title
  ) {
    this.generatePageMeta()
  }

  onSignup () {
    this.isLoginMode = !this.isLoginMode
	this.generatePageMeta()
  }
  unsubs: Subscription
  error = false
  message: string
  onSubmit (form: NgForm) {
    const email = form.value.email
    const password = form.value.password
    const name = form.value.name
    const userData = { email, name }
    if (this.isLoginMode) {
      this.unsubs = this.auth
        .login(email, password)
        .pipe(
          tap(() => {
            this.auth.getUser(email).subscribe(user => {
              if (user.length > 0) {
                this.name = user[0].name
                this.router.navigate(['/home'])
              }
            })
          })
        )
        .subscribe(
          res => {},
          errorMessage => {
            this.error = true
            this.message = errorMessage
          }
        )
    } else {
      this.unsubs = this.auth
        .signup(email, password)
        .pipe(
          tap(() => {
            this.auth.storeUser(userData).then(() => {})
          })
        )
        .subscribe(
          res => {},
          errorMessage => {
            this.error = true
            this.message = errorMessage
          }
        )
    }
  }
  reset = false
  toReset () {
    this.reset = !this.reset
  }
  resetSent = false
  res: string
  resetPassword (form: NgForm) {
    this.auth.resetPassword(form.value.email)
    this.resetSent = true
    this.res = 'CHECK your email '
  }
  ngOnDestroy (): void {
    this.unsubs.unsubscribe()
  }
  private generatePageMeta () {
    let title = 'Log in or Sign up | MindShare'
    this.title.setTitle(title)
    let description = `${
      this.isLoginMode ? 'Log in' : 'Sign Up'
    } to MindShare to start sharing and connecting with your friends, family and people you know.`
    this.metaService.updateTag({ name: 'description', content: description })
  }
}
