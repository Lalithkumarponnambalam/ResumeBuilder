import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICertificationDetails, CertificationDetails } from '../certification-details.model';
import { CertificationDetailsService } from '../service/certification-details.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-certification-details-update',
  templateUrl: './certification-details-update.component.html',
})
export class CertificationDetailsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    certificateName: [],
    institution: [],
    certificateDate: [],
    certificationSummary: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected certificationDetailsService: CertificationDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ certificationDetails }) => {
      this.updateForm(certificationDetails);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('resumeApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const certificationDetails = this.createFromForm();
    if (certificationDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.certificationDetailsService.update(certificationDetails));
    } else {
      this.subscribeToSaveResponse(this.certificationDetailsService.create(certificationDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICertificationDetails>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(certificationDetails: ICertificationDetails): void {
    this.editForm.patchValue({
      id: certificationDetails.id,
      certificateName: certificationDetails.certificateName,
      institution: certificationDetails.institution,
      certificateDate: certificationDetails.certificateDate,
      certificationSummary: certificationDetails.certificationSummary,
    });
  }

  protected createFromForm(): ICertificationDetails {
    return {
      ...new CertificationDetails(),
      id: this.editForm.get(['id'])!.value,
      certificateName: this.editForm.get(['certificateName'])!.value,
      institution: this.editForm.get(['institution'])!.value,
      certificateDate: this.editForm.get(['certificateDate'])!.value,
      certificationSummary: this.editForm.get(['certificationSummary'])!.value,
    };
  }
}
