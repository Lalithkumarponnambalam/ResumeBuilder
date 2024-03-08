import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKeySkills, getKeySkillsIdentifier } from '../key-skills.model';

export type EntityResponseType = HttpResponse<IKeySkills>;
export type EntityArrayResponseType = HttpResponse<IKeySkills[]>;

@Injectable({ providedIn: 'root' })
export class KeySkillsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/key-skills');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(keySkills: IKeySkills): Observable<EntityResponseType> {
    return this.http.post<IKeySkills>(this.resourceUrl, keySkills, { observe: 'response' });
  }

  update(keySkills: IKeySkills): Observable<EntityResponseType> {
    return this.http.put<IKeySkills>(`${this.resourceUrl}/${getKeySkillsIdentifier(keySkills) as number}`, keySkills, {
      observe: 'response',
    });
  }

  partialUpdate(keySkills: IKeySkills): Observable<EntityResponseType> {
    return this.http.patch<IKeySkills>(`${this.resourceUrl}/${getKeySkillsIdentifier(keySkills) as number}`, keySkills, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IKeySkills>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IKeySkills[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addKeySkillsToCollectionIfMissing(
    keySkillsCollection: IKeySkills[],
    ...keySkillsToCheck: (IKeySkills | null | undefined)[]
  ): IKeySkills[] {
    const keySkills: IKeySkills[] = keySkillsToCheck.filter(isPresent);
    if (keySkills.length > 0) {
      const keySkillsCollectionIdentifiers = keySkillsCollection.map(keySkillsItem => getKeySkillsIdentifier(keySkillsItem)!);
      const keySkillsToAdd = keySkills.filter(keySkillsItem => {
        const keySkillsIdentifier = getKeySkillsIdentifier(keySkillsItem);
        if (keySkillsIdentifier == null || keySkillsCollectionIdentifiers.includes(keySkillsIdentifier)) {
          return false;
        }
        keySkillsCollectionIdentifiers.push(keySkillsIdentifier);
        return true;
      });
      return [...keySkillsToAdd, ...keySkillsCollection];
    }
    return keySkillsCollection;
  }
}
