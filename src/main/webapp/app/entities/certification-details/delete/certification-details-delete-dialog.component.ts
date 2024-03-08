import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICertificationDetails } from '../certification-details.model';
import { CertificationDetailsService } from '../service/certification-details.service';

@Component({
  templateUrl: './certification-details-delete-dialog.component.html',
})
export class CertificationDetailsDeleteDialogComponent {
  certificationDetails?: ICertificationDetails;

  constructor(protected certificationDetailsService: CertificationDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.certificationDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
