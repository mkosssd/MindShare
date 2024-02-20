import { Component, inject, OnDestroy, TemplateRef } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastService } from 'src/app/services/toast.service';
import { ToastsContainer } from '../toast-container';

@Component({
	selector: 'ngbd-toast-global',
	standalone: true,
	imports: [NgbTooltipModule, ToastsContainer],
	templateUrl: './toast.component.html',
})
export class NgbdToastGlobal implements OnDestroy {
	toastService = inject(ToastService);

	showStandard(template: any) {
		this.toastService.show(template, 'bg-danger');
	}

	showSuccess(template: any) {
		// this.toastService.show({ template, classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(template: any) {
		// this.toastService.show({ template, classname: 'bg-danger text-light', delay: 15000 });
	}

	ngOnDestroy(): void {
		this.toastService.clear();
	}
}