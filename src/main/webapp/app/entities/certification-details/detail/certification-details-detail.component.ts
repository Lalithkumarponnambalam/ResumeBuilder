import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICertificationDetails } from '../certification-details.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-certification-details-detail',
  templateUrl: './certification-details-detail.component.html',
})
export class CertificationDetailsDetailComponent implements OnInit {
  certificationDetails: ICertificationDetails | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ certificationDetails }) => {
      this.certificationDetails = certificationDetails;
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
