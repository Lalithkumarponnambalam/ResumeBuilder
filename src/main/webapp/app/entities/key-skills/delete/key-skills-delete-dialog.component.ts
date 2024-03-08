import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKeySkills } from '../key-skills.model';
import { KeySkillsService } from '../service/key-skills.service';

@Component({
  templateUrl: './key-skills-delete-dialog.component.html',
})
export class KeySkillsDeleteDialogComponent {
  keySkills?: IKeySkills;

  constructor(protected keySkillsService: KeySkillsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.keySkillsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
