import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICertificationDetails, getCertificationDetailsIdentifier } from '../certification-details.model';

export type EntityResponseType = HttpResponse<ICertificationDetails>;
export type EntityArrayResponseType = HttpResponse<ICertificationDetails[]>;

@Injectable({ providedIn: 'root' })
export class CertificationDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/certification-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(certificationDetails: ICertificationDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificationDetails);
    return this.http
      .post<ICertificationDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(certificationDetails: ICertificationDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificationDetails);
    return this.http
      .put<ICertificationDetails>(`${this.resourceUrl}/${getCertificationDetailsIdentifier(certificationDetails) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(certificationDetails: ICertificationDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificationDetails);
    return this.http
      .patch<ICertificationDetails>(`${this.resourceUrl}/${getCertificationDetailsIdentifier(certificationDetails) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICertificationDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICertificationDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCertificationDetailsToCollectionIfMissing(
    certificationDetailsCollection: ICertificationDetails[],
    ...certificationDetailsToCheck: (ICertificationDetails | null | undefined)[]
  ): ICertificationDetails[] {
    const certificationDetails: ICertificationDetails[] = certificationDetailsToCheck.filter(isPresent);
    if (certificationDetails.length > 0) {
      const certificationDetailsCollectionIdentifiers = certificationDetailsCollection.map(
        certificationDetailsItem => getCertificationDetailsIdentifier(certificationDetailsItem)!
      );
      const certificationDetailsToAdd = certificationDetails.filter(certificationDetailsItem => {
        const certificationDetailsIdentifier = getCertificationDetailsIdentifier(certificationDetailsItem);
        if (certificationDetailsIdentifier == null || certificationDetailsCollectionIdentifiers.includes(certificationDetailsIdentifier)) {
          return false;
        }
        certificationDetailsCollectionIdentifiers.push(certificationDetailsIdentifier);
        return true;
      });
      return [...certificationDetailsToAdd, ...certificationDetailsCollection];
    }
    return certificationDetailsCollection;
  }

  protected convertDateFromClient(certificationDetails: ICertificationDetails): ICertificationDetails {
    return Object.assign({}, certificationDetails, {
      certificateDate: certificationDetails.certificateDate?.isValid()
        ? certificationDetails.certificateDate.format(DATE_FORMAT)
        : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.certificateDate = res.body.certificateDate ? dayjs(res.body.certificateDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((certificationDetails: ICertificationDetails) => {
        certificationDetails.certificateDate = certificationDetails.certificateDate
          ? dayjs(certificationDetails.certificateDate)
          : undefined;
      });
    }
    return res;
  }
}
