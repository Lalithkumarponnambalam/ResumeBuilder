import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICertificationDetails } from '../certification-details.model';
import { CertificationDetailsService } from '../service/certification-details.service';
import { CertificationDetailsDeleteDialogComponent } from '../delete/certification-details-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-certification-details',
  templateUrl: './certification-details.component.html',
})
export class CertificationDetailsComponent implements OnInit {
  certificationDetails?: ICertificationDetails[];
  isLoading = false;

  constructor(
    protected certificationDetailsService: CertificationDetailsService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.certificationDetailsService.query().subscribe({
      next: (res: HttpResponse<ICertificationDetails[]>) => {
        this.isLoading = false;
        this.certificationDetails = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICertificationDetails): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(certificationDetails: ICertificationDetails): void {
    const modalRef = this.modalService.open(CertificationDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.certificationDetails = certificationDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
