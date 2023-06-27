import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { IntUserData } from './user.model'
import { environment } from 'src/environments/environment'
import { AngularFireAuth } from '@angular/fire/compat/auth'

export interface User {
  name: string
  email: string
  bio: string
  profilePic: string
  username: string
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
  forUpload = new BehaviorSubject<User | null>(null)
  private tokenExpirationTimer: any

  constructor (
    private http: HttpClient,
    private firestore: AngularFirestore,
    private router: Router,
    private firAuth: AngularFireAuth
  ) {}

  signup (email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.firebaseAPIKey,
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
          this.router.navigate(['/home'])
        })
      )
  }

  name: string = ''

  login (email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
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
        })
      )
  }
  defProfile =
    'https://firebasestorage.googleapis.com/v0/b/mindshare-3ab39.appspot.com/o/Screenshot%202023-06-17%20183301.jpg?alt=media&token=c964126f-6daf-446a-b445-d6c0e314836c'
  bio = ''
  adjectives = [
    'Cool',
    'Awesome',
    'Epic',
    'Rad',
    'Sleek',
    'Stellar',
    'Ninja',
    'Dynamic',
    'Glorious',
    'Mystic'
  ]
  nouns = [
    'Phoenix',
    'Vortex',
    'Zenith',
    'Luminary',
    'Nova',
    'Spectre',
    'Infinity',
    'Avalanche',
    'Champion',
    'Enigma'
  ]
  randomAdjective =
    this.adjectives[Math.floor(Math.random() * this.adjectives.length)]
  randomNoun = this.nouns[Math.floor(Math.random() * this.nouns.length)]
  username = this.randomAdjective + this.randomNoun
  storeUser (userData: { email: string; name: string }) {
    return this.firestore.collection<User>('UserData').add({
      name: userData.name,
      email: userData.email,
      bio: this.bio,
      profilePic: this.defProfile,
      username: this.username + Math.floor(Math.random() * (1 + 999 + 1) + 1)
    })
  }

  getUser (email: string) {
    return this.firestore
      .collection<User>('UserData', ref => ref.where('email', '==', email))
      .valueChanges()
  }

  private handleError (errorResponse: HttpErrorResponse) {
    // this.error = 'AN ERROR OCCURED'
    let errorMessage = 'An unknown error occured!'
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage)
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use!'
        break
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project!'
        break
      case 'INVALID_EMAIL':
        errorMessage = 'Please enter a valid email'
        break
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'user not found!'
        break
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password!'
        break
      case 'USER_DISABLED':
        errorMessage = 'User has been disabled'
        break
      default:
        errorMessage = errorResponse.error.error.message
    }
    return throwError(errorMessage)
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
      this.getUser(loadedUser.email).subscribe()
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
  resetPassword (email) {
    this.firAuth.sendPasswordResetEmail(email)
    
  }
}
