import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEducationDetails, getEducationDetailsIdentifier } from '../education-details.model';

export type EntityResponseType = HttpResponse<IEducationDetails>;
export type EntityArrayResponseType = HttpResponse<IEducationDetails[]>;

@Injectable({ providedIn: 'root' })
export class EducationDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/education-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(educationDetails: IEducationDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(educationDetails);
    return this.http
      .post<IEducationDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(educationDetails: IEducationDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(educationDetails);
    return this.http
      .put<IEducationDetails>(`${this.resourceUrl}/${getEducationDetailsIdentifier(educationDetails) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(educationDetails: IEducationDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(educationDetails);
    return this.http
      .patch<IEducationDetails>(`${this.resourceUrl}/${getEducationDetailsIdentifier(educationDetails) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEducationDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEducationDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEducationDetailsToCollectionIfMissing(
    educationDetailsCollection: IEducationDetails[],
    ...educationDetailsToCheck: (IEducationDetails | null | undefined)[]
  ): IEducationDetails[] {
    const educationDetails: IEducationDetails[] = educationDetailsToCheck.filter(isPresent);
    if (educationDetails.length > 0) {
      const educationDetailsCollectionIdentifiers = educationDetailsCollection.map(
        educationDetailsItem => getEducationDetailsIdentifier(educationDetailsItem)!
      );
      const educationDetailsToAdd = educationDetails.filter(educationDetailsItem => {
        const educationDetailsIdentifier = getEducationDetailsIdentifier(educationDetailsItem);
        if (educationDetailsIdentifier == null || educationDetailsCollectionIdentifiers.includes(educationDetailsIdentifier)) {
          return false;
        }
        educationDetailsCollectionIdentifiers.push(educationDetailsIdentifier);
        return true;
      });
      return [...educationDetailsToAdd, ...educationDetailsCollection];
    }
    return educationDetailsCollection;
  }

  protected convertDateFromClient(educationDetails: IEducationDetails): IEducationDetails {
    return Object.assign({}, educationDetails, {
      startDate: educationDetails.startDate?.isValid() ? educationDetails.startDate.format(DATE_FORMAT) : undefined,
      endDate: educationDetails.endDate?.isValid() ? educationDetails.endDate.format(DATE_FORMAT) : undefined,
      graduationDate: educationDetails.graduationDate?.isValid() ? educationDetails.graduationDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
      res.body.graduationDate = res.body.graduationDate ? dayjs(res.body.graduationDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((educationDetails: IEducationDetails) => {
        educationDetails.startDate = educationDetails.startDate ? dayjs(educationDetails.startDate) : undefined;
        educationDetails.endDate = educationDetails.endDate ? dayjs(educationDetails.endDate) : undefined;
        educationDetails.graduationDate = educationDetails.graduationDate ? dayjs(educationDetails.graduationDate) : undefined;
      });
    }
    return res;
  }
}
