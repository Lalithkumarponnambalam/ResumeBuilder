import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILanguages, getLanguagesIdentifier } from '../languages.model';

export type EntityResponseType = HttpResponse<ILanguages>;
export type EntityArrayResponseType = HttpResponse<ILanguages[]>;

@Injectable({ providedIn: 'root' })
export class LanguagesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/languages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(languages: ILanguages): Observable<EntityResponseType> {
    return this.http.post<ILanguages>(this.resourceUrl, languages, { observe: 'response' });
  }

  update(languages: ILanguages): Observable<EntityResponseType> {
    return this.http.put<ILanguages>(`${this.resourceUrl}/${getLanguagesIdentifier(languages) as number}`, languages, {
      observe: 'response',
    });
  }

  partialUpdate(languages: ILanguages): Observable<EntityResponseType> {
    return this.http.patch<ILanguages>(`${this.resourceUrl}/${getLanguagesIdentifier(languages) as number}`, languages, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILanguages>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILanguages[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLanguagesToCollectionIfMissing(
    languagesCollection: ILanguages[],
    ...languagesToCheck: (ILanguages | null | undefined)[]
  ): ILanguages[] {
    const languages: ILanguages[] = languagesToCheck.filter(isPresent);
    if (languages.length > 0) {
      const languagesCollectionIdentifiers = languagesCollection.map(languagesItem => getLanguagesIdentifier(languagesItem)!);
      const languagesToAdd = languages.filter(languagesItem => {
        const languagesIdentifier = getLanguagesIdentifier(languagesItem);
        if (languagesIdentifier == null || languagesCollectionIdentifiers.includes(languagesIdentifier)) {
          return false;
        }
        languagesCollectionIdentifiers.push(languagesIdentifier);
        return true;
      });
      return [...languagesToAdd, ...languagesCollection];
    }
    return languagesCollection;
  }
}
