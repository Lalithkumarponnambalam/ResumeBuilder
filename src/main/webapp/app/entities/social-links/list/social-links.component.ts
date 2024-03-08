import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISocialLinks } from '../social-links.model';
import { SocialLinksService } from '../service/social-links.service';
import { SocialLinksDeleteDialogComponent } from '../delete/social-links-delete-dialog.component';

@Component({
  selector: 'jhi-social-links',
  templateUrl: './social-links.component.html',
})
export class SocialLinksComponent implements OnInit {
  socialLinks?: ISocialLinks[];
  isLoading = false;

  constructor(protected socialLinksService: SocialLinksService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.socialLinksService.query().subscribe({
      next: (res: HttpResponse<ISocialLinks[]>) => {
        this.isLoading = false;
        this.socialLinks = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISocialLinks): number {
    return item.id!;
  }

  delete(socialLinks: ISocialLinks): void {
    const modalRef = this.modalService.open(SocialLinksDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.socialLinks = socialLinks;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
