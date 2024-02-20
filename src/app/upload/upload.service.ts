import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { AuthService } from '../auth/auth.service'
import { ToastService } from '../services/toast.service'

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  user: string
  userName: string

  constructor (private firestore: AngularFirestore, private auth: AuthService, private toastService:ToastService) {}

  upload (caps: string, imgPath: string) {
    this.auth.user.subscribe(res => {
      this.auth.getUser(res.email).subscribe(userRes => {
        this.user = userRes[0].email
        this.userName = userRes[0].name

        this.firestore
          .collection('newPosts')
          .add({
            email: this.user,
            caption: caps,
            path: imgPath,
            name: this.userName,
            date: new Date().getTime(),
            postId: this.firestore.createId(),
            likes: 0,
            likedBy: []
          })
          .then(() => {
            this.toastService.show('Post Uploaded Successfully!','bg-success')
            
          })
          .catch(error => {
            this.toastService.show('Unable to Post! Please try again later.','bg-danger')
          })
      })
    })
  }
}
