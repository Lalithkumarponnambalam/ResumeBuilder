import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInternship, getInternshipIdentifier } from '../internship.model';

export type EntityResponseType = HttpResponse<IInternship>;
export type EntityArrayResponseType = HttpResponse<IInternship[]>;

@Injectable({ providedIn: 'root' })
export class InternshipService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/internships');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(internship: IInternship): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(internship);
    return this.http
      .post<IInternship>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(internship: IInternship): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(internship);
    return this.http
      .put<IInternship>(`${this.resourceUrl}/${getInternshipIdentifier(internship) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(internship: IInternship): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(internship);
    return this.http
      .patch<IInternship>(`${this.resourceUrl}/${getInternshipIdentifier(internship) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IInternship>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IInternship[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInternshipToCollectionIfMissing(
    internshipCollection: IInternship[],
    ...internshipsToCheck: (IInternship | null | undefined)[]
  ): IInternship[] {
    const internships: IInternship[] = internshipsToCheck.filter(isPresent);
    if (internships.length > 0) {
      const internshipCollectionIdentifiers = internshipCollection.map(internshipItem => getInternshipIdentifier(internshipItem)!);
      const internshipsToAdd = internships.filter(internshipItem => {
        const internshipIdentifier = getInternshipIdentifier(internshipItem);
        if (internshipIdentifier == null || internshipCollectionIdentifiers.includes(internshipIdentifier)) {
          return false;
        }
        internshipCollectionIdentifiers.push(internshipIdentifier);
        return true;
      });
      return [...internshipsToAdd, ...internshipCollection];
    }
    return internshipCollection;
  }

  protected convertDateFromClient(internship: IInternship): IInternship {
    return Object.assign({}, internship, {
      startDate: internship.startDate?.isValid() ? internship.startDate.format(DATE_FORMAT) : undefined,
      endDate: internship.endDate?.isValid() ? internship.endDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((internship: IInternship) => {
        internship.startDate = internship.startDate ? dayjs(internship.startDate) : undefined;
        internship.endDate = internship.endDate ? dayjs(internship.endDate) : undefined;
      });
    }
    return res;
  }
}
