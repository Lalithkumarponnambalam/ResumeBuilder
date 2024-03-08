import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAreaofInterest } from '../areaof-interest.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-areaof-interest-detail',
  templateUrl: './areaof-interest-detail.component.html',
})
export class AreaofInterestDetailComponent implements OnInit {
  areaofInterest: IAreaofInterest | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ areaofInterest }) => {
      this.areaofInterest = areaofInterest;
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
