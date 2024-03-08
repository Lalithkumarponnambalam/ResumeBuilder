import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICertificationDetails, CertificationDetails } from '../certification-details.model';
import { CertificationDetailsService } from '../service/certification-details.service';

@Injectable({ providedIn: 'root' })
export class CertificationDetailsRoutingResolveService implements Resolve<ICertificationDetails> {
  constructor(protected service: CertificationDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICertificationDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((certificationDetails: HttpResponse<CertificationDetails>) => {
          if (certificationDetails.body) {
            return of(certificationDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CertificationDetails());
  }
}
