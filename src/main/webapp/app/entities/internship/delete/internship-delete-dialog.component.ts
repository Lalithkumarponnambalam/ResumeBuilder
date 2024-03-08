import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInternship } from '../internship.model';
import { InternshipService } from '../service/internship.service';

@Component({
  templateUrl: './internship-delete-dialog.component.html',
})
export class InternshipDeleteDialogComponent {
  internship?: IInternship;

  constructor(protected internshipService: InternshipService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.internshipService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
