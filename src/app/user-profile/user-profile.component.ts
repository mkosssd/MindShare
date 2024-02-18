import { Component, Injectable, OnInit } from '@angular/core'
import { AuthService } from '../auth/auth.service'
import { NgForm } from '@angular/forms'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Subscription, finalize } from 'rxjs'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { PostsService } from '../home/posts.service'
import { Meta, Title } from '@angular/platform-browser'
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class UserProfileComponent implements OnInit {
  name: string = ''
  email: string = ''
  profilePic:string = ''
  username:string = ''
  bio:string = ''
  fetch:boolean = false
  private unsub: Subscription
  private unsub2: Subscription
  selectedProfile: File | null = null
  constructor (
    private auth: AuthService,
    private firestoreDB: AngularFirestore,
    private storage: AngularFireStorage,
    private getUserPosts: PostsService,
    private metaService: Meta,
    private titleService: Title
  ) {}
  onLoad = false
  ngOnInit (): void {
    this.onLoad = true
    this.auth.user.subscribe(user => {
      if (user) {
        this.auth.getUser(user.email).subscribe(res => {
          if (res.length > 0) {
            this.name = res[0].name
            this.email = res[0].email
            this.bio = res[0].bio
            if (res[0] && res[0].hasOwnProperty('profilePic')) {
              this.profilePic = res[0].profilePic
            } else {
              this.profilePic =
                'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200'
            }
            if (res[0] && res[0].hasOwnProperty('username')) {
              this.username = res[0].username
            } else {
              this.username = 'NA'
            }
            this.onLoad = false
          }
        })
      }
    })
	this.generatePageMeta()
  }
  onFileSelected (event: any) {
    this.selectedProfile = event.target.files[0]
    if (this.selectedProfile) {
      this.picUpload()
    }
  }
  picUpload () {
    this.onLoad = true
    const filePath = `profile/${this.selectedProfile.name}`
    const fileRef = this.storage.ref(filePath)
    const uploadTask = this.storage.upload(filePath, this.selectedProfile)

    this.unsub2 = uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: string) => {
            this.profilePic = url
            this.onLoad = false
          })
        })
      )
      .subscribe()
  }
  change () {
    document.getElementById('upload').click()
  }
  editMode = false
  editModeFunc () {
    this.editMode = !this.editMode
  }

  editServ (form: NgForm) {
    const bio = form.value.bio
    const name = form.value.name
    const username = form.value.username
    const userD = 'UserData'
    const query = this.firestoreDB.collection(userD, ref =>
      ref.where('email', '==', this.email)
    )
    this.unsub = query.snapshotChanges().subscribe(querySnap => {
      querySnap.forEach(docChange => {
        const docId = docChange.payload.doc.id
        this.firestoreDB.doc(`${userD}/${docId}`).update({
          bio: bio,
          name: name,
          profilePic: this.profilePic,
          username: username
        })
      })
      this.unsub.unsubscribe()
    })
    this.editModeFunc()
  }

  fetchPosts () {
    this.getUserPosts.getUserPosts(this.email).subscribe(res => {
    })
  }
  private generatePageMeta(){
	let title = 'User Profile | MindShare'
	this.titleService.setTitle(title)
	let description = 'View Your Own Profile | MindShare'
	this.metaService.updateTag({ name: 'description', content: description });
  }
}
