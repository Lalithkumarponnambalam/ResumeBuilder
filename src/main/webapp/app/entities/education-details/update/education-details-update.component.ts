import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEducationDetails, EducationDetails } from '../education-details.model';
import { EducationDetailsService } from '../service/education-details.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-education-details-update',
  templateUrl: './education-details-update.component.html',
})
export class EducationDetailsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    schoolName: [null, [Validators.required]],
    city: [],
    state: [],
    startDate: [],
    endDate: [],
    degree: [],
    fieldofStudy: [],
    graduationDate: [],
    educationSummary: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected educationDetailsService: EducationDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ educationDetails }) => {
      this.updateForm(educationDetails);
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
    const educationDetails = this.createFromForm();
    if (educationDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.educationDetailsService.update(educationDetails));
    } else {
      this.subscribeToSaveResponse(this.educationDetailsService.create(educationDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEducationDetails>>): void {
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

  protected updateForm(educationDetails: IEducationDetails): void {
    this.editForm.patchValue({
      id: educationDetails.id,
      schoolName: educationDetails.schoolName,
      city: educationDetails.city,
      state: educationDetails.state,
      startDate: educationDetails.startDate,
      endDate: educationDetails.endDate,
      degree: educationDetails.degree,
      fieldofStudy: educationDetails.fieldofStudy,
      graduationDate: educationDetails.graduationDate,
      educationSummary: educationDetails.educationSummary,
    });
  }

  protected createFromForm(): IEducationDetails {
    return {
      ...new EducationDetails(),
      id: this.editForm.get(['id'])!.value,
      schoolName: this.editForm.get(['schoolName'])!.value,
      city: this.editForm.get(['city'])!.value,
      state: this.editForm.get(['state'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      degree: this.editForm.get(['degree'])!.value,
      fieldofStudy: this.editForm.get(['fieldofStudy'])!.value,
      graduationDate: this.editForm.get(['graduationDate'])!.value,
      educationSummary: this.editForm.get(['educationSummary'])!.value,
    };
  }
}
