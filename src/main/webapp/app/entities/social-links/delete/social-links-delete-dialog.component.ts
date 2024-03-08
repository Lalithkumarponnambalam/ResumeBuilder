import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISocialLinks } from '../social-links.model';
import { SocialLinksService } from '../service/social-links.service';

@Component({
  templateUrl: './social-links-delete-dialog.component.html',
})
export class SocialLinksDeleteDialogComponent {
  socialLinks?: ISocialLinks;

  constructor(protected socialLinksService: SocialLinksService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.socialLinksService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
