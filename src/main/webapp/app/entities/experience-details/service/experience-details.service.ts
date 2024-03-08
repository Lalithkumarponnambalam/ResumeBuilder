import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExperienceDetails, getExperienceDetailsIdentifier } from '../experience-details.model';

export type EntityResponseType = HttpResponse<IExperienceDetails>;
export type EntityArrayResponseType = HttpResponse<IExperienceDetails[]>;

@Injectable({ providedIn: 'root' })
export class ExperienceDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/experience-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(experienceDetails: IExperienceDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(experienceDetails);
    return this.http
      .post<IExperienceDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(experienceDetails: IExperienceDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(experienceDetails);
    return this.http
      .put<IExperienceDetails>(`${this.resourceUrl}/${getExperienceDetailsIdentifier(experienceDetails) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(experienceDetails: IExperienceDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(experienceDetails);
    return this.http
      .patch<IExperienceDetails>(`${this.resourceUrl}/${getExperienceDetailsIdentifier(experienceDetails) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IExperienceDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExperienceDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExperienceDetailsToCollectionIfMissing(
    experienceDetailsCollection: IExperienceDetails[],
    ...experienceDetailsToCheck: (IExperienceDetails | null | undefined)[]
  ): IExperienceDetails[] {
    const experienceDetails: IExperienceDetails[] = experienceDetailsToCheck.filter(isPresent);
    if (experienceDetails.length > 0) {
      const experienceDetailsCollectionIdentifiers = experienceDetailsCollection.map(
        experienceDetailsItem => getExperienceDetailsIdentifier(experienceDetailsItem)!
      );
      const experienceDetailsToAdd = experienceDetails.filter(experienceDetailsItem => {
        const experienceDetailsIdentifier = getExperienceDetailsIdentifier(experienceDetailsItem);
        if (experienceDetailsIdentifier == null || experienceDetailsCollectionIdentifiers.includes(experienceDetailsIdentifier)) {
          return false;
        }
        experienceDetailsCollectionIdentifiers.push(experienceDetailsIdentifier);
        return true;
      });
      return [...experienceDetailsToAdd, ...experienceDetailsCollection];
    }
    return experienceDetailsCollection;
  }

  protected convertDateFromClient(experienceDetails: IExperienceDetails): IExperienceDetails {
    return Object.assign({}, experienceDetails, {
      startDate: experienceDetails.startDate?.isValid() ? experienceDetails.startDate.format(DATE_FORMAT) : undefined,
      endDate: experienceDetails.endDate?.isValid() ? experienceDetails.endDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((experienceDetails: IExperienceDetails) => {
        experienceDetails.startDate = experienceDetails.startDate ? dayjs(experienceDetails.startDate) : undefined;
        experienceDetails.endDate = experienceDetails.endDate ? dayjs(experienceDetails.endDate) : undefined;
      });
    }
    return res;
  }
}
