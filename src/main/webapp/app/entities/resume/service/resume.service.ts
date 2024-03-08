import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResume, getResumeIdentifier } from '../resume.model';

export type EntityResponseType = HttpResponse<IResume>;
export type EntityArrayResponseType = HttpResponse<IResume[]>;

@Injectable({ providedIn: 'root' })
export class ResumeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/resumes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(resume: IResume): Observable<EntityResponseType> {
    return this.http.post<IResume>(this.resourceUrl, resume, { observe: 'response' });
  }

  update(resume: IResume): Observable<EntityResponseType> {
    return this.http.put<IResume>(`${this.resourceUrl}/${getResumeIdentifier(resume) as number}`, resume, { observe: 'response' });
  }

  partialUpdate(resume: IResume): Observable<EntityResponseType> {
    return this.http.patch<IResume>(`${this.resourceUrl}/${getResumeIdentifier(resume) as number}`, resume, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResume>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResume[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addResumeToCollectionIfMissing(resumeCollection: IResume[], ...resumesToCheck: (IResume | null | undefined)[]): IResume[] {
    const resumes: IResume[] = resumesToCheck.filter(isPresent);
    if (resumes.length > 0) {
      const resumeCollectionIdentifiers = resumeCollection.map(resumeItem => getResumeIdentifier(resumeItem)!);
      const resumesToAdd = resumes.filter(resumeItem => {
        const resumeIdentifier = getResumeIdentifier(resumeItem);
        if (resumeIdentifier == null || resumeCollectionIdentifiers.includes(resumeIdentifier)) {
          return false;
        }
        resumeCollectionIdentifiers.push(resumeIdentifier);
        return true;
      });
      return [...resumesToAdd, ...resumeCollection];
    }
    return resumeCollection;
  }
}
