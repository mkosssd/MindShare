import { Component } from '@angular/core'
import { NgForm } from '@angular/forms'
import { AuthService } from './auth.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true
  // users: User[] = [];
  name = ''
  email = ''
  
  constructor (private auth: AuthService,private router:Router) {}

  onSignup () {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit (form: NgForm) {
    console.log(form.value)
    const email = form.value.email
    const password = form.value.password
    const name = form.value.name
    const userData = { email, name }

    if (this.isLoginMode) {
      this.auth.login(email, password).subscribe(() => {
        this.auth.getUser(email).subscribe(res => {

          this.name = res[0].name
          this.email = res[0].email
          console.log(this.name,this.email)
          this.router.navigate(['/upload'])
        })
      })
    } else {
      this.auth.signup(email, password).subscribe(() => {
        this.auth.storeUser(userData)
      })
    }
  }
}
