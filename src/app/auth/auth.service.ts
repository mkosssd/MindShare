import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, catchError, filter, tap, throwError } from 'rxjs'
import { Router } from '@angular/router'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { IntUserData } from './user.model'

export interface User {
  name: string
  email: string
}
export interface AuthResponseData {
  kind: string
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered?: boolean
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<IntUserData | null>(null)
  private tokenExpirationTimer: any

  constructor (
    private http: HttpClient,
    private firestore: AngularFirestore,
    private router: Router
  ) {}
  signup (email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCgZpa69S4Mt_o_x8QIrm6S7mYE-QWbE1o',
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          )
          console.log(resData)
        })
      )
  }
  login (email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCgZpa69S4Mt_o_x8QIrm6S7mYE-QWbE1o',
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData =>
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          )
        )
      )
  }
  storeUser (userData: { email: string; name: string }) {
    // return this.firestore.collection('/UserData').add(userData)
    return this.firestore.collection('UserData').add({
      name: userData.name,
      email: userData.email
    })
  }
  getUser (email: string) {
    console.log(email)
    return this.firestore
      .collection<User>('UserData', ref => ref.where('email', '==', email))
      .valueChanges()
  }
  //  db.collection('users').where()
  // let users =  this.firestore.collection('/UserData',ref=>ref.where('email','==',email)).valueChanges()
  // console.log(users)
  // users.subscribe(users => {

  //   let user = users[0];

  //   console.log("this is the user:" + user);

  // });
  // console.log(this.firestore.collection('UserData'))
  // console.log('dsadhubiasjdiuoasduihauodhnadsiuoj')
  // console.log(this.firestore.collection('/UserData'))
  // // let user = users[0]
  // console.log(users)

  private handleError (errorResponse: HttpErrorResponse) {
    // console.log(errorResponse)
    return throwError(errorResponse.error.error.message)
  }
  private handleAuth (
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expiresInDate = new Date(new Date().getTime() + expiresIn * 1000)
    const userDetails = new IntUserData(email, userId, token, expiresInDate)
    this.user.next(userDetails)
    this.autoLogout(expiresIn * 1000)
    localStorage.setItem('loggedData', JSON.stringify(userDetails))
  }
  autoLogin () {
    const loggedDataString: string | null = localStorage.getItem('loggedData')
    const loggedUserData: {
      email: string
      userId: string
      _token: string
      _tokenExpirationDate: string
    } | null = loggedDataString ? JSON.parse(loggedDataString) : null

    if (!loggedUserData) {
      return
    }

    const loadedUser = new IntUserData(
      loggedUserData.email,
      loggedUserData.userId,
      loggedUserData._token,
      new Date(loggedUserData._tokenExpirationDate)
    )

    if (loadedUser.token) {
      this.user.next(loadedUser)
      const expireDuration =
        new Date(loggedUserData._tokenExpirationDate).getTime() -
        new Date().getTime()
      this.autoLogout(expireDuration)
    }
  }
  autoLogout (expireDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()
    }, expireDuration)
  }
  logout () {
    this.user.next(null)
    this.router.navigate(['/auth'])
    localStorage.removeItem('loggedData')
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null
  }
}
