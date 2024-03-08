import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ICertificationDetails, CertificationDetails } from '../certification-details.model';

import { CertificationDetailsService } from './certification-details.service';

describe('CertificationDetails Service', () => {
  let service: CertificationDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: ICertificationDetails;
  let expectedResult: ICertificationDetails | ICertificationDetails[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CertificationDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      certificateName: 'AAAAAAA',
      institution: 'AAAAAAA',
      certificateDate: currentDate,
      certificationSummary: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          certificateDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a CertificationDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          certificateDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          certificateDate: currentDate,
        },
        returnedFromService
      );

      service.create(new CertificationDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CertificationDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          certificateName: 'BBBBBB',
          institution: 'BBBBBB',
          certificateDate: currentDate.format(DATE_FORMAT),
          certificationSummary: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          certificateDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CertificationDetails', () => {
      const patchObject = Object.assign(
        {
          institution: 'BBBBBB',
          certificationSummary: 'BBBBBB',
        },
        new CertificationDetails()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          certificateDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CertificationDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          certificateName: 'BBBBBB',
          institution: 'BBBBBB',
          certificateDate: currentDate.format(DATE_FORMAT),
          certificationSummary: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          certificateDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a CertificationDetails', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCertificationDetailsToCollectionIfMissing', () => {
      it('should add a CertificationDetails to an empty array', () => {
        const certificationDetails: ICertificationDetails = { id: 123 };
        expectedResult = service.addCertificationDetailsToCollectionIfMissing([], certificationDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(certificationDetails);
      });

      it('should not add a CertificationDetails to an array that contains it', () => {
        const certificationDetails: ICertificationDetails = { id: 123 };
        const certificationDetailsCollection: ICertificationDetails[] = [
          {
            ...certificationDetails,
          },
          { id: 456 },
        ];
        expectedResult = service.addCertificationDetailsToCollectionIfMissing(certificationDetailsCollection, certificationDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CertificationDetails to an array that doesn't contain it", () => {
        const certificationDetails: ICertificationDetails = { id: 123 };
        const certificationDetailsCollection: ICertificationDetails[] = [{ id: 456 }];
        expectedResult = service.addCertificationDetailsToCollectionIfMissing(certificationDetailsCollection, certificationDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(certificationDetails);
      });

      it('should add only unique CertificationDetails to an array', () => {
        const certificationDetailsArray: ICertificationDetails[] = [{ id: 123 }, { id: 456 }, { id: 88647 }];
        const certificationDetailsCollection: ICertificationDetails[] = [{ id: 123 }];
        expectedResult = service.addCertificationDetailsToCollectionIfMissing(certificationDetailsCollection, ...certificationDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const certificationDetails: ICertificationDetails = { id: 123 };
        const certificationDetails2: ICertificationDetails = { id: 456 };
        expectedResult = service.addCertificationDetailsToCollectionIfMissing([], certificationDetails, certificationDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(certificationDetails);
        expect(expectedResult).toContain(certificationDetails2);
      });

      it('should accept null and undefined values', () => {
        const certificationDetails: ICertificationDetails = { id: 123 };
        expectedResult = service.addCertificationDetailsToCollectionIfMissing([], null, certificationDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(certificationDetails);
      });

      it('should return initial array if no CertificationDetails is added', () => {
        const certificationDetailsCollection: ICertificationDetails[] = [{ id: 123 }];
        expectedResult = service.addCertificationDetailsToCollectionIfMissing(certificationDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(certificationDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
