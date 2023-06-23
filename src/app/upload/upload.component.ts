import { Component,OnDestroy } from '@angular/core'
import { NgForm } from '@angular/forms'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { finalize } from 'rxjs/operators'
import { UploadService } from './upload.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  onLoad: boolean = false
  selectedFile: File | null = null
  constructor (
    private storage: AngularFireStorage,
    private uploadServ: UploadService,
    private router: Router
  ) {}
  serveredImg = true
  imgs = ''
  onFileSelected (event: any) {
    this.selectedFile = event.target.files[0]
    // this.mediaType = this.selectedFile.type.includes('image') ? 'img' : 'video';
  }
  uploaded=true
  onUpload (form: NgForm) {
    const caps = form.value.caption

    if (this.selectedFile) {
      this.onLoad = true
      this.uploadServ.upload(caps, this.imgs)
      this.router.navigate(['/home'])
      this.onLoad = false
    }
  }
  // private subs:Subscription
  picUpload () {
    this.uploaded =false
    this.onLoad = true
    this.serveredImg = false
    const filePath = `images/${this.selectedFile.name}`
    const fileRef = this.storage.ref(filePath)
    const uploadTask = this.storage.upload(filePath, this.selectedFile)
  
    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: string) => {
            // console.log('File available at:', url)
            this.imgs = url
            this.onLoad = false
          })
        })
      )
      .subscribe()
  }
  reset (form: NgForm) {
    form.reset()
    this.imgs = ''
    this.serveredImg = true
  }
  ngOnDestroy(): void {
    // this.subs.unsubscribe()
    
  }
}
