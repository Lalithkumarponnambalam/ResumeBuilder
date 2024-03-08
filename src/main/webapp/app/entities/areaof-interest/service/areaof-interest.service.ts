import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAreaofInterest, getAreaofInterestIdentifier } from '../areaof-interest.model';

export type EntityResponseType = HttpResponse<IAreaofInterest>;
export type EntityArrayResponseType = HttpResponse<IAreaofInterest[]>;

@Injectable({ providedIn: 'root' })
export class AreaofInterestService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/areaof-interests');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(areaofInterest: IAreaofInterest): Observable<EntityResponseType> {
    return this.http.post<IAreaofInterest>(this.resourceUrl, areaofInterest, { observe: 'response' });
  }

  update(areaofInterest: IAreaofInterest): Observable<EntityResponseType> {
    return this.http.put<IAreaofInterest>(`${this.resourceUrl}/${getAreaofInterestIdentifier(areaofInterest) as number}`, areaofInterest, {
      observe: 'response',
    });
  }

  partialUpdate(areaofInterest: IAreaofInterest): Observable<EntityResponseType> {
    return this.http.patch<IAreaofInterest>(
      `${this.resourceUrl}/${getAreaofInterestIdentifier(areaofInterest) as number}`,
      areaofInterest,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAreaofInterest>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAreaofInterest[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAreaofInterestToCollectionIfMissing(
    areaofInterestCollection: IAreaofInterest[],
    ...areaofInterestsToCheck: (IAreaofInterest | null | undefined)[]
  ): IAreaofInterest[] {
    const areaofInterests: IAreaofInterest[] = areaofInterestsToCheck.filter(isPresent);
    if (areaofInterests.length > 0) {
      const areaofInterestCollectionIdentifiers = areaofInterestCollection.map(
        areaofInterestItem => getAreaofInterestIdentifier(areaofInterestItem)!
      );
      const areaofInterestsToAdd = areaofInterests.filter(areaofInterestItem => {
        const areaofInterestIdentifier = getAreaofInterestIdentifier(areaofInterestItem);
        if (areaofInterestIdentifier == null || areaofInterestCollectionIdentifiers.includes(areaofInterestIdentifier)) {
          return false;
        }
        areaofInterestCollectionIdentifiers.push(areaofInterestIdentifier);
        return true;
      });
      return [...areaofInterestsToAdd, ...areaofInterestCollection];
    }
    return areaofInterestCollection;
  }
}
