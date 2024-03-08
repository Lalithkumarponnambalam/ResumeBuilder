import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorkDetails } from '../work-details.model';
import { WorkDetailsService } from '../service/work-details.service';

@Component({
  templateUrl: './work-details-delete-dialog.component.html',
})
export class WorkDetailsDeleteDialogComponent {
  workDetails?: IWorkDetails;

  constructor(protected workDetailsService: WorkDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.workDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
