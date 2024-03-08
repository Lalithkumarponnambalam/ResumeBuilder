import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILanguages } from '../languages.model';

@Component({
  selector: 'jhi-languages-detail',
  templateUrl: './languages-detail.component.html',
})
export class LanguagesDetailComponent implements OnInit {
  languages: ILanguages | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ languages }) => {
      this.languages = languages;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
