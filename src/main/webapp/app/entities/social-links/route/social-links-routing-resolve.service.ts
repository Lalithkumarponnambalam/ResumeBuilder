import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISocialLinks, SocialLinks } from '../social-links.model';
import { SocialLinksService } from '../service/social-links.service';

@Injectable({ providedIn: 'root' })
export class SocialLinksRoutingResolveService implements Resolve<ISocialLinks> {
  constructor(protected service: SocialLinksService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISocialLinks> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((socialLinks: HttpResponse<SocialLinks>) => {
          if (socialLinks.body) {
            return of(socialLinks.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SocialLinks());
  }
}
