import { Injectable, OnInit } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable, Subscription } from 'rxjs'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { AuthService } from '../auth/auth.service'

export interface Posts {
  email: string
  caption: string
  path: string
  date: Date
  name: string
  postId: string
  likes: number
  likedBy: []
}

@Injectable({
  providedIn: 'root'
})
export class PostsService implements OnInit {
  currentUser: any
  constructor (private firestore: AngularFirestore, private auth: AuthService) {}
  ngOnInit (): void {
    this.auth.user.subscribe(res => (this.currentUser = res.email))
  }
  private unsub: Subscription
  getPosts (): Observable<any> {
    return this.firestore.collection('newPosts').valueChanges()
  }

  getUserPosts (email: any) {
    return this.firestore
      .collection('newPosts', ref => ref.where('email', '==', email))
      .valueChanges()
  }

  toggleLikes (
    postId: string,
    likes: number,
    curUser: string,
    addremove: string
  ) {
    const posts = 'newPosts'
    const query = this.firestore.collection(posts, ref =>
      ref.where('postId', '==', postId)
    )

    this.unsub = query.snapshotChanges().subscribe(querySnap => {
      querySnap.forEach(docChange => {
        const docId = docChange.payload.doc.id

        if (addremove == 'add') {
          this.firestore.doc(`${posts}/${docId}`).update({
            likes: likes,
            likedBy: arrayUnion(curUser)
          })
        } else {
          this.firestore.doc(`${posts}/${docId}`).update({
            likes: likes,
            likedBy: arrayRemove(curUser)
          })
        }
        this.unsub.unsubscribe()
      })
    })
  }
}
