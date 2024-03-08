import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILanguages, Languages } from '../languages.model';
import { LanguagesService } from '../service/languages.service';
import { LangOptions } from 'app/entities/enumerations/lang-options.model';

@Component({
  selector: 'jhi-languages-update',
  templateUrl: './languages-update.component.html',
})
export class LanguagesUpdateComponent implements OnInit {
  isSaving = false;
  langOptionsValues = Object.keys(LangOptions);

  editForm = this.fb.group({
    id: [],
    langOption: [],
  });

  constructor(protected languagesService: LanguagesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ languages }) => {
      this.updateForm(languages);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const languages = this.createFromForm();
    if (languages.id !== undefined) {
      this.subscribeToSaveResponse(this.languagesService.update(languages));
    } else {
      this.subscribeToSaveResponse(this.languagesService.create(languages));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILanguages>>): void {
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

  protected updateForm(languages: ILanguages): void {
    this.editForm.patchValue({
      id: languages.id,
      langOption: languages.langOption,
    });
  }

  protected createFromForm(): ILanguages {
    return {
      ...new Languages(),
      id: this.editForm.get(['id'])!.value,
      langOption: this.editForm.get(['langOption'])!.value,
    };
  }
}
