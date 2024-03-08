import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAreaofInterest, AreaofInterest } from '../areaof-interest.model';
import { AreaofInterestService } from '../service/areaof-interest.service';

@Injectable({ providedIn: 'root' })
export class AreaofInterestRoutingResolveService implements Resolve<IAreaofInterest> {
  constructor(protected service: AreaofInterestService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAreaofInterest> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((areaofInterest: HttpResponse<AreaofInterest>) => {
          if (areaofInterest.body) {
            return of(areaofInterest.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AreaofInterest());
  }
}
