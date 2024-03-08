import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IKeySkills } from '../key-skills.model';
import { KeySkillsService } from '../service/key-skills.service';
import { KeySkillsDeleteDialogComponent } from '../delete/key-skills-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-key-skills',
  templateUrl: './key-skills.component.html',
})
export class KeySkillsComponent implements OnInit {
  keySkills?: IKeySkills[];
  isLoading = false;

  constructor(protected keySkillsService: KeySkillsService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.keySkillsService.query().subscribe({
      next: (res: HttpResponse<IKeySkills[]>) => {
        this.isLoading = false;
        this.keySkills = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IKeySkills): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(keySkills: IKeySkills): void {
    const modalRef = this.modalService.open(KeySkillsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.keySkills = keySkills;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
