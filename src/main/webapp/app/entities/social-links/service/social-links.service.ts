import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISocialLinks, getSocialLinksIdentifier } from '../social-links.model';

export type EntityResponseType = HttpResponse<ISocialLinks>;
export type EntityArrayResponseType = HttpResponse<ISocialLinks[]>;

@Injectable({ providedIn: 'root' })
export class SocialLinksService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/social-links');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(socialLinks: ISocialLinks): Observable<EntityResponseType> {
    return this.http.post<ISocialLinks>(this.resourceUrl, socialLinks, { observe: 'response' });
  }

  update(socialLinks: ISocialLinks): Observable<EntityResponseType> {
    return this.http.put<ISocialLinks>(`${this.resourceUrl}/${getSocialLinksIdentifier(socialLinks) as number}`, socialLinks, {
      observe: 'response',
    });
  }

  partialUpdate(socialLinks: ISocialLinks): Observable<EntityResponseType> {
    return this.http.patch<ISocialLinks>(`${this.resourceUrl}/${getSocialLinksIdentifier(socialLinks) as number}`, socialLinks, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISocialLinks>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISocialLinks[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSocialLinksToCollectionIfMissing(
    socialLinksCollection: ISocialLinks[],
    ...socialLinksToCheck: (ISocialLinks | null | undefined)[]
  ): ISocialLinks[] {
    const socialLinks: ISocialLinks[] = socialLinksToCheck.filter(isPresent);
    if (socialLinks.length > 0) {
      const socialLinksCollectionIdentifiers = socialLinksCollection.map(socialLinksItem => getSocialLinksIdentifier(socialLinksItem)!);
      const socialLinksToAdd = socialLinks.filter(socialLinksItem => {
        const socialLinksIdentifier = getSocialLinksIdentifier(socialLinksItem);
        if (socialLinksIdentifier == null || socialLinksCollectionIdentifiers.includes(socialLinksIdentifier)) {
          return false;
        }
        socialLinksCollectionIdentifiers.push(socialLinksIdentifier);
        return true;
      });
      return [...socialLinksToAdd, ...socialLinksCollection];
    }
    return socialLinksCollection;
  }
}
