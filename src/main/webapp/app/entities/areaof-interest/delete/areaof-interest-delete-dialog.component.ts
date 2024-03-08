import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAreaofInterest } from '../areaof-interest.model';
import { AreaofInterestService } from '../service/areaof-interest.service';

@Component({
  templateUrl: './areaof-interest-delete-dialog.component.html',
})
export class AreaofInterestDeleteDialogComponent {
  areaofInterest?: IAreaofInterest;

  constructor(protected areaofInterestService: AreaofInterestService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.areaofInterestService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
