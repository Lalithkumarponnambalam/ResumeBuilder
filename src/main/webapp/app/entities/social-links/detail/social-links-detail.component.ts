import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISocialLinks } from '../social-links.model';

@Component({
  selector: 'jhi-social-links-detail',
  templateUrl: './social-links-detail.component.html',
})
export class SocialLinksDetailComponent implements OnInit {
  socialLinks: ISocialLinks | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ socialLinks }) => {
      this.socialLinks = socialLinks;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
