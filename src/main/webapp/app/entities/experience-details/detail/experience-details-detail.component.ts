import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExperienceDetails } from '../experience-details.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-experience-details-detail',
  templateUrl: './experience-details-detail.component.html',
})
export class ExperienceDetailsDetailComponent implements OnInit {
  experienceDetails: IExperienceDetails | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ experienceDetails }) => {
      this.experienceDetails = experienceDetails;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
