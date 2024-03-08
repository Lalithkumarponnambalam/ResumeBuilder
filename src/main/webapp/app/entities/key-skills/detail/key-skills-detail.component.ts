import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKeySkills } from '../key-skills.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-key-skills-detail',
  templateUrl: './key-skills-detail.component.html',
})
export class KeySkillsDetailComponent implements OnInit {
  keySkills: IKeySkills | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ keySkills }) => {
      this.keySkills = keySkills;
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
