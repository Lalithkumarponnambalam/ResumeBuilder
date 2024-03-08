import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IResume } from '../resume.model';
import { ResumeService } from '../service/resume.service';
import { ResumeDeleteDialogComponent } from '../delete/resume-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-resume',
  templateUrl: './resume.component.html',
})
export class ResumeComponent implements OnInit {
  resumes?: IResume[];
  isLoading = false;

  constructor(protected resumeService: ResumeService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.resumeService.query().subscribe({
      next: (res: HttpResponse<IResume[]>) => {
        this.isLoading = false;
        this.resumes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IResume): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(resume: IResume): void {
    const modalRef = this.modalService.open(ResumeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resume = resume;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
