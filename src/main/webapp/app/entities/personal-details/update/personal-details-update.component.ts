import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPersonalDetails, PersonalDetails } from '../personal-details.model';
import { PersonalDetailsService } from '../service/personal-details.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-personal-details-update',
  templateUrl: './personal-details-update.component.html',
})
export class PersonalDetailsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    profilePhoto: [],
    profilePhotoContentType: [],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    email: [null, [Validators.required]],
    phone: [],
    address: [],
    city: [],
    state: [],
    zipCode: [],
    country: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected personalDetailsService: PersonalDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ personalDetails }) => {
      this.updateForm(personalDetails);
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
    const personalDetails = this.createFromForm();
    if (personalDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.personalDetailsService.update(personalDetails));
    } else {
      this.subscribeToSaveResponse(this.personalDetailsService.create(personalDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonalDetails>>): void {
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

  protected updateForm(personalDetails: IPersonalDetails): void {
    this.editForm.patchValue({
      id: personalDetails.id,
      profilePhoto: personalDetails.profilePhoto,
      profilePhotoContentType: personalDetails.profilePhotoContentType,
      firstName: personalDetails.firstName,
      lastName: personalDetails.lastName,
      email: personalDetails.email,
      phone: personalDetails.phone,
      address: personalDetails.address,
      city: personalDetails.city,
      state: personalDetails.state,
      zipCode: personalDetails.zipCode,
      country: personalDetails.country,
    });
  }

  protected createFromForm(): IPersonalDetails {
    return {
      ...new PersonalDetails(),
      id: this.editForm.get(['id'])!.value,
      profilePhotoContentType: this.editForm.get(['profilePhotoContentType'])!.value,
      profilePhoto: this.editForm.get(['profilePhoto'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      address: this.editForm.get(['address'])!.value,
      city: this.editForm.get(['city'])!.value,
      state: this.editForm.get(['state'])!.value,
      zipCode: this.editForm.get(['zipCode'])!.value,
      country: this.editForm.get(['country'])!.value,
    };
  }
}
