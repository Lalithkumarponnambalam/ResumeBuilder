import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExperienceDetails, ExperienceDetails } from '../experience-details.model';
import { ExperienceDetailsService } from '../service/experience-details.service';

@Injectable({ providedIn: 'root' })
export class ExperienceDetailsRoutingResolveService implements Resolve<IExperienceDetails> {
  constructor(protected service: ExperienceDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExperienceDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((experienceDetails: HttpResponse<ExperienceDetails>) => {
          if (experienceDetails.body) {
            return of(experienceDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ExperienceDetails());
  }
}
