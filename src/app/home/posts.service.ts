import { Injectable, OnInit } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable, Subject } from 'rxjs'
export interface Posts {
  email: string
  caption: string
  path: string
  date: Date
  name: string
  postId:string
}
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor (private firestore: AngularFirestore) {}
  getPosts (): Observable<any> {
    return this.firestore.collection('newPosts').valueChanges()
  }
  getUserPosts (email: any) {
    return this.firestore.collection('newPosts', ref =>
      ref.where('email', '==', email)
    ).valueChanges()
  }
}
