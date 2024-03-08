import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IInternship, Internship } from '../internship.model';

import { InternshipService } from './internship.service';

describe('Internship Service', () => {
  let service: InternshipService;
  let httpMock: HttpTestingController;
  let elemDefault: IInternship;
  let expectedResult: IInternship | IInternship[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InternshipService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      jobTitle: 'AAAAAAA',
      employer: 'AAAAAAA',
      companyName: 'AAAAAAA',
      address: 'AAAAAAA',
      startDate: currentDate,
      endDate: currentDate,
      internshipSummary: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Internship', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Internship()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Internship', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jobTitle: 'BBBBBB',
          employer: 'BBBBBB',
          companyName: 'BBBBBB',
          address: 'BBBBBB',
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
          internshipSummary: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Internship', () => {
      const patchObject = Object.assign(
        {
          jobTitle: 'BBBBBB',
          companyName: 'BBBBBB',
          address: 'BBBBBB',
          endDate: currentDate.format(DATE_FORMAT),
          internshipSummary: 'BBBBBB',
        },
        new Internship()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Internship', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jobTitle: 'BBBBBB',
          employer: 'BBBBBB',
          companyName: 'BBBBBB',
          address: 'BBBBBB',
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
          internshipSummary: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Internship', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addInternshipToCollectionIfMissing', () => {
      it('should add a Internship to an empty array', () => {
        const internship: IInternship = { id: 123 };
        expectedResult = service.addInternshipToCollectionIfMissing([], internship);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(internship);
      });

      it('should not add a Internship to an array that contains it', () => {
        const internship: IInternship = { id: 123 };
        const internshipCollection: IInternship[] = [
          {
            ...internship,
          },
          { id: 456 },
        ];
        expectedResult = service.addInternshipToCollectionIfMissing(internshipCollection, internship);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Internship to an array that doesn't contain it", () => {
        const internship: IInternship = { id: 123 };
        const internshipCollection: IInternship[] = [{ id: 456 }];
        expectedResult = service.addInternshipToCollectionIfMissing(internshipCollection, internship);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(internship);
      });

      it('should add only unique Internship to an array', () => {
        const internshipArray: IInternship[] = [{ id: 123 }, { id: 456 }, { id: 73053 }];
        const internshipCollection: IInternship[] = [{ id: 123 }];
        expectedResult = service.addInternshipToCollectionIfMissing(internshipCollection, ...internshipArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const internship: IInternship = { id: 123 };
        const internship2: IInternship = { id: 456 };
        expectedResult = service.addInternshipToCollectionIfMissing([], internship, internship2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(internship);
        expect(expectedResult).toContain(internship2);
      });

      it('should accept null and undefined values', () => {
        const internship: IInternship = { id: 123 };
        expectedResult = service.addInternshipToCollectionIfMissing([], null, internship, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(internship);
      });

      it('should return initial array if no Internship is added', () => {
        const internshipCollection: IInternship[] = [{ id: 123 }];
        expectedResult = service.addInternshipToCollectionIfMissing(internshipCollection, undefined, null);
        expect(expectedResult).toEqual(internshipCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
