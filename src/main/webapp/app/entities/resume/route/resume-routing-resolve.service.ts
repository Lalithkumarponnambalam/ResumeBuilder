import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IResume, Resume } from '../resume.model';
import { ResumeService } from '../service/resume.service';

@Injectable({ providedIn: 'root' })
export class ResumeRoutingResolveService implements Resolve<IResume> {
  constructor(protected service: ResumeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IResume> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((resume: HttpResponse<Resume>) => {
          if (resume.body) {
            return of(resume.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Resume());
  }
}
