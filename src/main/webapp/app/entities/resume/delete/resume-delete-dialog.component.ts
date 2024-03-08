import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IResume } from '../resume.model';
import { ResumeService } from '../service/resume.service';

@Component({
  templateUrl: './resume-delete-dialog.component.html',
})
export class ResumeDeleteDialogComponent {
  resume?: IResume;

  constructor(protected resumeService: ResumeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resumeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
