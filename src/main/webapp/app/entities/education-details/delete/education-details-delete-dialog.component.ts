import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEducationDetails } from '../education-details.model';
import { EducationDetailsService } from '../service/education-details.service';

@Component({
  templateUrl: './education-details-delete-dialog.component.html',
})
export class EducationDetailsDeleteDialogComponent {
  educationDetails?: IEducationDetails;

  constructor(protected educationDetailsService: EducationDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.educationDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
