import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IExperienceDetails, ExperienceDetails } from '../experience-details.model';
import { ExperienceDetailsService } from '../service/experience-details.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-experience-details-update',
  templateUrl: './experience-details-update.component.html',
})
export class ExperienceDetailsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    positionTitle: [],
    companyName: [],
    startDate: [],
    endDate: [],
    workSummary: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected experienceDetailsService: ExperienceDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ experienceDetails }) => {
      this.updateForm(experienceDetails);
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
    const experienceDetails = this.createFromForm();
    if (experienceDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.experienceDetailsService.update(experienceDetails));
    } else {
      this.subscribeToSaveResponse(this.experienceDetailsService.create(experienceDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExperienceDetails>>): void {
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

  protected updateForm(experienceDetails: IExperienceDetails): void {
    this.editForm.patchValue({
      id: experienceDetails.id,
      positionTitle: experienceDetails.positionTitle,
      companyName: experienceDetails.companyName,
      startDate: experienceDetails.startDate,
      endDate: experienceDetails.endDate,
      workSummary: experienceDetails.workSummary,
    });
  }

  protected createFromForm(): IExperienceDetails {
    return {
      ...new ExperienceDetails(),
      id: this.editForm.get(['id'])!.value,
      positionTitle: this.editForm.get(['positionTitle'])!.value,
      companyName: this.editForm.get(['companyName'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      workSummary: this.editForm.get(['workSummary'])!.value,
    };
  }
}
