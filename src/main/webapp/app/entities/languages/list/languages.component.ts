import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILanguages } from '../languages.model';
import { LanguagesService } from '../service/languages.service';
import { LanguagesDeleteDialogComponent } from '../delete/languages-delete-dialog.component';

@Component({
  selector: 'jhi-languages',
  templateUrl: './languages.component.html',
})
export class LanguagesComponent implements OnInit {
  languages?: ILanguages[];
  isLoading = false;

  constructor(protected languagesService: LanguagesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.languagesService.query().subscribe({
      next: (res: HttpResponse<ILanguages[]>) => {
        this.isLoading = false;
        this.languages = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ILanguages): number {
    return item.id!;
  }

  delete(languages: ILanguages): void {
    const modalRef = this.modalService.open(LanguagesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.languages = languages;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
