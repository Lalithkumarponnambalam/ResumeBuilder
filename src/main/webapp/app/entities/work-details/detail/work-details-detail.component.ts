import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkDetails } from '../work-details.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-work-details-detail',
  templateUrl: './work-details-detail.component.html',
})
export class WorkDetailsDetailComponent implements OnInit {
  workDetails: IWorkDetails | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workDetails }) => {
      this.workDetails = workDetails;
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
