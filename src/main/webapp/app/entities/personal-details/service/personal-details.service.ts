import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPersonalDetails, getPersonalDetailsIdentifier } from '../personal-details.model';

export type EntityResponseType = HttpResponse<IPersonalDetails>;
export type EntityArrayResponseType = HttpResponse<IPersonalDetails[]>;

@Injectable({ providedIn: 'root' })
export class PersonalDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/personal-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(personalDetails: IPersonalDetails): Observable<EntityResponseType> {
    return this.http.post<IPersonalDetails>(this.resourceUrl, personalDetails, { observe: 'response' });
  }

  update(personalDetails: IPersonalDetails): Observable<EntityResponseType> {
    return this.http.put<IPersonalDetails>(
      `${this.resourceUrl}/${getPersonalDetailsIdentifier(personalDetails) as number}`,
      personalDetails,
      { observe: 'response' }
    );
  }

  partialUpdate(personalDetails: IPersonalDetails): Observable<EntityResponseType> {
    return this.http.patch<IPersonalDetails>(
      `${this.resourceUrl}/${getPersonalDetailsIdentifier(personalDetails) as number}`,
      personalDetails,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPersonalDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPersonalDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPersonalDetailsToCollectionIfMissing(
    personalDetailsCollection: IPersonalDetails[],
    ...personalDetailsToCheck: (IPersonalDetails | null | undefined)[]
  ): IPersonalDetails[] {
    const personalDetails: IPersonalDetails[] = personalDetailsToCheck.filter(isPresent);
    if (personalDetails.length > 0) {
      const personalDetailsCollectionIdentifiers = personalDetailsCollection.map(
        personalDetailsItem => getPersonalDetailsIdentifier(personalDetailsItem)!
      );
      const personalDetailsToAdd = personalDetails.filter(personalDetailsItem => {
        const personalDetailsIdentifier = getPersonalDetailsIdentifier(personalDetailsItem);
        if (personalDetailsIdentifier == null || personalDetailsCollectionIdentifiers.includes(personalDetailsIdentifier)) {
          return false;
        }
        personalDetailsCollectionIdentifiers.push(personalDetailsIdentifier);
        return true;
      });
      return [...personalDetailsToAdd, ...personalDetailsCollection];
    }
    return personalDetailsCollection;
  }
}
