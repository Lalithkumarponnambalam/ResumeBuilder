import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISocialLinks, SocialLinks } from '../social-links.model';
import { SocialLinksService } from '../service/social-links.service';

@Component({
  selector: 'jhi-social-links-update',
  templateUrl: './social-links-update.component.html',
})
export class SocialLinksUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    lable: [],
    link: [],
  });

  constructor(protected socialLinksService: SocialLinksService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ socialLinks }) => {
      this.updateForm(socialLinks);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const socialLinks = this.createFromForm();
    if (socialLinks.id !== undefined) {
      this.subscribeToSaveResponse(this.socialLinksService.update(socialLinks));
    } else {
      this.subscribeToSaveResponse(this.socialLinksService.create(socialLinks));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISocialLinks>>): void {
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

  protected updateForm(socialLinks: ISocialLinks): void {
    this.editForm.patchValue({
      id: socialLinks.id,
      lable: socialLinks.lable,
      link: socialLinks.link,
    });
  }

  protected createFromForm(): ISocialLinks {
    return {
      ...new SocialLinks(),
      id: this.editForm.get(['id'])!.value,
      lable: this.editForm.get(['lable'])!.value,
      link: this.editForm.get(['link'])!.value,
    };
  }
}
