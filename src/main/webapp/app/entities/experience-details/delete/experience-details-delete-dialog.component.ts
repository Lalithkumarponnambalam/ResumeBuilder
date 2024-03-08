import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExperienceDetails } from '../experience-details.model';
import { ExperienceDetailsService } from '../service/experience-details.service';

@Component({
  templateUrl: './experience-details-delete-dialog.component.html',
})
export class ExperienceDetailsDeleteDialogComponent {
  experienceDetails?: IExperienceDetails;

  constructor(protected experienceDetailsService: ExperienceDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.experienceDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
