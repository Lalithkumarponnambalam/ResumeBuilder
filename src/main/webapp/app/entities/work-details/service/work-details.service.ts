import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWorkDetails, getWorkDetailsIdentifier } from '../work-details.model';

export type EntityResponseType = HttpResponse<IWorkDetails>;
export type EntityArrayResponseType = HttpResponse<IWorkDetails[]>;

@Injectable({ providedIn: 'root' })
export class WorkDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/work-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(workDetails: IWorkDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(workDetails);
    return this.http
      .post<IWorkDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(workDetails: IWorkDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(workDetails);
    return this.http
      .put<IWorkDetails>(`${this.resourceUrl}/${getWorkDetailsIdentifier(workDetails) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(workDetails: IWorkDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(workDetails);
    return this.http
      .patch<IWorkDetails>(`${this.resourceUrl}/${getWorkDetailsIdentifier(workDetails) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IWorkDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IWorkDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addWorkDetailsToCollectionIfMissing(
    workDetailsCollection: IWorkDetails[],
    ...workDetailsToCheck: (IWorkDetails | null | undefined)[]
  ): IWorkDetails[] {
    const workDetails: IWorkDetails[] = workDetailsToCheck.filter(isPresent);
    if (workDetails.length > 0) {
      const workDetailsCollectionIdentifiers = workDetailsCollection.map(workDetailsItem => getWorkDetailsIdentifier(workDetailsItem)!);
      const workDetailsToAdd = workDetails.filter(workDetailsItem => {
        const workDetailsIdentifier = getWorkDetailsIdentifier(workDetailsItem);
        if (workDetailsIdentifier == null || workDetailsCollectionIdentifiers.includes(workDetailsIdentifier)) {
          return false;
        }
        workDetailsCollectionIdentifiers.push(workDetailsIdentifier);
        return true;
      });
      return [...workDetailsToAdd, ...workDetailsCollection];
    }
    return workDetailsCollection;
  }

  protected convertDateFromClient(workDetails: IWorkDetails): IWorkDetails {
    return Object.assign({}, workDetails, {
      startDate: workDetails.startDate?.isValid() ? workDetails.startDate.format(DATE_FORMAT) : undefined,
      endDate: workDetails.endDate?.isValid() ? workDetails.endDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((workDetails: IWorkDetails) => {
        workDetails.startDate = workDetails.startDate ? dayjs(workDetails.startDate) : undefined;
        workDetails.endDate = workDetails.endDate ? dayjs(workDetails.endDate) : undefined;
      });
    }
    return res;
  }
}
