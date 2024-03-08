import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorkDetails } from '../work-details.model';
import { WorkDetailsService } from '../service/work-details.service';
import { WorkDetailsDeleteDialogComponent } from '../delete/work-details-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-work-details',
  templateUrl: './work-details.component.html',
})
export class WorkDetailsComponent implements OnInit {
  workDetails?: IWorkDetails[];
  isLoading = false;

  constructor(protected workDetailsService: WorkDetailsService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.workDetailsService.query().subscribe({
      next: (res: HttpResponse<IWorkDetails[]>) => {
        this.isLoading = false;
        this.workDetails = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IWorkDetails): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(workDetails: IWorkDetails): void {
    const modalRef = this.modalService.open(WorkDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.workDetails = workDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
