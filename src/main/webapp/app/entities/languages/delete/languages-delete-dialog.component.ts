import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILanguages } from '../languages.model';
import { LanguagesService } from '../service/languages.service';

@Component({
  templateUrl: './languages-delete-dialog.component.html',
})
export class LanguagesDeleteDialogComponent {
  languages?: ILanguages;

  constructor(protected languagesService: LanguagesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.languagesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
