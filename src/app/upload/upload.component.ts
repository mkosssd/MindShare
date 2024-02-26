import { Component, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { finalize } from 'rxjs/operators'
import { UploadService } from './upload.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { Meta, Title } from '@angular/platform-browser'
import { ToastService } from '../services/toast.service'
import { CropperComponent } from 'angular-cropperjs'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  onLoad: boolean = false
  selectedFile: File | null = null
  subs: Subscription
  @ViewChild('angularCropper') public angularCropper: CropperComponent
  constructor (
    private storage: AngularFireStorage,
    private uploadServ: UploadService,
    private router: Router,
    private metaService: Meta,
    private titleService: Title,
    private toastService: ToastService
  ) {
    this.generatePageMeta()
  }

  serveredImg = true
  imgs = ''
  targetUrl = ''
  base64: any
  targetImg = ''


  uploaded = true
  angularCropperHandler (event: Event) {
    this.base64 = event
  }
  onUpload (form: NgForm) {
    const caps = form.value.caption

    this.onLoad = true
    if (this.base64) {
      this.uploadServ.upload(caps, this.base64)
      this.reset(form)
      this.onLoad = false
    }
  }

  reset (form: NgForm) {
    form.reset()
    this.imgs = ''
    this.serveredImg = true
    setTimeout(() => {
      this.router.navigate(['home'])
    }, 1000)
  }

  inputFunc () {
    document.getElementById('imagePath').click()
  }
  private generatePageMeta () {
    let title = 'Share your thoughts | MindShare'
    this.titleService.setTitle(title)
    let description = 'Upload or Share something on MindShare'
    this.metaService.updateTag({ name: 'description', content: description })
  }
}
