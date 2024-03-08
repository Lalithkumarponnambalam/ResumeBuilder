import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IExperienceDetails } from '../experience-details.model';
import { ExperienceDetailsService } from '../service/experience-details.service';
import { ExperienceDetailsDeleteDialogComponent } from '../delete/experience-details-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-experience-details',
  templateUrl: './experience-details.component.html',
})
export class ExperienceDetailsComponent implements OnInit {
  experienceDetails?: IExperienceDetails[];
  isLoading = false;

  constructor(
    protected experienceDetailsService: ExperienceDetailsService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.experienceDetailsService.query().subscribe({
      next: (res: HttpResponse<IExperienceDetails[]>) => {
        this.isLoading = false;
        this.experienceDetails = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IExperienceDetails): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(experienceDetails: IExperienceDetails): void {
    const modalRef = this.modalService.open(ExperienceDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.experienceDetails = experienceDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
