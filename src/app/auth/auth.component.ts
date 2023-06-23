import { Component, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn:'root'
})
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  name = '';
  email = '';
  constructor (private auth: AuthService, private router: Router) {}

  onSignup () {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit (form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    const userData = { email, name };

    if (this.isLoginMode) {
      this.auth.login(email, password).pipe(
        tap(() => {
          this.auth.getUser(email).subscribe(user => {
            if (user.length > 0) {
              this.name = user[0].name;
              this.router.navigate(['/home'])
            }
          });
          // this.router.navigate(['/user-profile']);
        })
      ).subscribe();
    } else {
      this.auth.signup(email, password).pipe(
        tap(() => {
          this.auth.storeUser(userData).then(() => {
            // this.router.navigate(['/user-profile']);
          });
        })
      ).subscribe();
    }
  }
}
