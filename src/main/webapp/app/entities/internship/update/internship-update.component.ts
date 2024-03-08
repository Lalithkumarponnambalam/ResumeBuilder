import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IInternship, Internship } from '../internship.model';
import { InternshipService } from '../service/internship.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-internship-update',
  templateUrl: './internship-update.component.html',
})
export class InternshipUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    jobTitle: [],
    employer: [],
    companyName: [],
    address: [],
    startDate: [],
    endDate: [],
    internshipSummary: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected internshipService: InternshipService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ internship }) => {
      this.updateForm(internship);
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
    const internship = this.createFromForm();
    if (internship.id !== undefined) {
      this.subscribeToSaveResponse(this.internshipService.update(internship));
    } else {
      this.subscribeToSaveResponse(this.internshipService.create(internship));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInternship>>): void {
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

  protected updateForm(internship: IInternship): void {
    this.editForm.patchValue({
      id: internship.id,
      jobTitle: internship.jobTitle,
      employer: internship.employer,
      companyName: internship.companyName,
      address: internship.address,
      startDate: internship.startDate,
      endDate: internship.endDate,
      internshipSummary: internship.internshipSummary,
    });
  }

  protected createFromForm(): IInternship {
    return {
      ...new Internship(),
      id: this.editForm.get(['id'])!.value,
      jobTitle: this.editForm.get(['jobTitle'])!.value,
      employer: this.editForm.get(['employer'])!.value,
      companyName: this.editForm.get(['companyName'])!.value,
      address: this.editForm.get(['address'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      internshipSummary: this.editForm.get(['internshipSummary'])!.value,
    };
  }
}
