import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILanguages, Languages } from '../languages.model';
import { LanguagesService } from '../service/languages.service';

@Injectable({ providedIn: 'root' })
export class LanguagesRoutingResolveService implements Resolve<ILanguages> {
  constructor(protected service: LanguagesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILanguages> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((languages: HttpResponse<Languages>) => {
          if (languages.body) {
            return of(languages.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Languages());
  }
}
