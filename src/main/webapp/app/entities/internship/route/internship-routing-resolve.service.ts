import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInternship, Internship } from '../internship.model';
import { InternshipService } from '../service/internship.service';

@Injectable({ providedIn: 'root' })
export class InternshipRoutingResolveService implements Resolve<IInternship> {
  constructor(protected service: InternshipService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInternship> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((internship: HttpResponse<Internship>) => {
          if (internship.body) {
            return of(internship.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Internship());
  }
}
