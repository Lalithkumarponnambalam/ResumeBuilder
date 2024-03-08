import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAreaofInterest } from '../areaof-interest.model';
import { AreaofInterestService } from '../service/areaof-interest.service';
import { AreaofInterestDeleteDialogComponent } from '../delete/areaof-interest-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-areaof-interest',
  templateUrl: './areaof-interest.component.html',
})
export class AreaofInterestComponent implements OnInit {
  areaofInterests?: IAreaofInterest[];
  isLoading = false;

  constructor(protected areaofInterestService: AreaofInterestService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.areaofInterestService.query().subscribe({
      next: (res: HttpResponse<IAreaofInterest[]>) => {
        this.isLoading = false;
        this.areaofInterests = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAreaofInterest): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(areaofInterest: IAreaofInterest): void {
    const modalRef = this.modalService.open(AreaofInterestDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.areaofInterest = areaofInterest;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
