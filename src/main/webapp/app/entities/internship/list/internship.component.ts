import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInternship } from '../internship.model';
import { InternshipService } from '../service/internship.service';
import { InternshipDeleteDialogComponent } from '../delete/internship-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-internship',
  templateUrl: './internship.component.html',
})
export class InternshipComponent implements OnInit {
  internships?: IInternship[];
  isLoading = false;

  constructor(protected internshipService: InternshipService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.internshipService.query().subscribe({
      next: (res: HttpResponse<IInternship[]>) => {
        this.isLoading = false;
        this.internships = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IInternship): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(internship: IInternship): void {
    const modalRef = this.modalService.open(InternshipDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.internship = internship;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
