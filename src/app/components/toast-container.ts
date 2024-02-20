import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap'
import { ToastService } from '../services/toast.service'
import { CommonModule, NgTemplateOutlet } from '@angular/common'
import { Component, inject } from '@angular/core'

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet, CommonModule],
  template: `
    <div *ngFor="let toast of toastService.toasts">
      <ngb-toast
        ngb-toast
        [class]="toast.classname"
        [autohide]="true"
        [delay]="toast.delay || 3000"
        (hidden)="toastService.remove(toast)"
      >
        {{ toast.template }}
      </ngb-toast>
    </div>
  `,
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200'
  }
})
export class ToastsContainer {
  toastService = inject(ToastService)
}
