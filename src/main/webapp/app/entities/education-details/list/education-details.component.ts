import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEducationDetails } from '../education-details.model';
import { EducationDetailsService } from '../service/education-details.service';
import { EducationDetailsDeleteDialogComponent } from '../delete/education-details-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-education-details',
  templateUrl: './education-details.component.html',
})
export class EducationDetailsComponent implements OnInit {
  educationDetails?: IEducationDetails[];
  isLoading = false;

  constructor(
    protected educationDetailsService: EducationDetailsService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.educationDetailsService.query().subscribe({
      next: (res: HttpResponse<IEducationDetails[]>) => {
        this.isLoading = false;
        this.educationDetails = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IEducationDetails): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(educationDetails: IEducationDetails): void {
    const modalRef = this.modalService.open(EducationDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.educationDetails = educationDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
