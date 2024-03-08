import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPersonalDetails } from '../personal-details.model';
import { PersonalDetailsService } from '../service/personal-details.service';

@Component({
  templateUrl: './personal-details-delete-dialog.component.html',
})
export class PersonalDetailsDeleteDialogComponent {
  personalDetails?: IPersonalDetails;

  constructor(protected personalDetailsService: PersonalDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.personalDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
