import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWorkDetails, WorkDetails } from '../work-details.model';
import { WorkDetailsService } from '../service/work-details.service';

@Injectable({ providedIn: 'root' })
export class WorkDetailsRoutingResolveService implements Resolve<IWorkDetails> {
  constructor(protected service: WorkDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWorkDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((workDetails: HttpResponse<WorkDetails>) => {
          if (workDetails.body) {
            return of(workDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new WorkDetails());
  }
}
