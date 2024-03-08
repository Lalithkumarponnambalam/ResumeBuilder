import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKeySkills, KeySkills } from '../key-skills.model';
import { KeySkillsService } from '../service/key-skills.service';

@Injectable({ providedIn: 'root' })
export class KeySkillsRoutingResolveService implements Resolve<IKeySkills> {
  constructor(protected service: KeySkillsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKeySkills> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((keySkills: HttpResponse<KeySkills>) => {
          if (keySkills.body) {
            return of(keySkills.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new KeySkills());
  }
}
