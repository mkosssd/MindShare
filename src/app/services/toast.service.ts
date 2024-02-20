import { Injectable, TemplateRef } from '@angular/core'

export interface Toast {
  template: string
  classname?: string
  delay?: number
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = []

  show (template: string, classname:string) {
    this.toasts.push({
		template: template,
		classname: classname
	  })

  }

  remove (toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast)
  }

  clear () {
    this.toasts.splice(0, this.toasts.length)
  }
}
