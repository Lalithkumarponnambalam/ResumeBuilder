import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPersonalDetails } from '../personal-details.model';
import { PersonalDetailsService } from '../service/personal-details.service';
import { PersonalDetailsDeleteDialogComponent } from '../delete/personal-details-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-personal-details',
  templateUrl: './personal-details.component.html',
})
export class PersonalDetailsComponent implements OnInit {
  personalDetails?: IPersonalDetails[];
  isLoading = false;

  constructor(protected personalDetailsService: PersonalDetailsService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.personalDetailsService.query().subscribe({
      next: (res: HttpResponse<IPersonalDetails[]>) => {
        this.isLoading = false;
        this.personalDetails = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPersonalDetails): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(personalDetails: IPersonalDetails): void {
    const modalRef = this.modalService.open(PersonalDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.personalDetails = personalDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
