import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IWorkDetails, WorkDetails } from '../work-details.model';

import { WorkDetailsService } from './work-details.service';

describe('WorkDetails Service', () => {
  let service: WorkDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: IWorkDetails;
  let expectedResult: IWorkDetails | IWorkDetails[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WorkDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      jobTitle: 'AAAAAAA',
      position: 'AAAAAAA',
      companyName: 'AAAAAAA',
      city: 'AAAAAAA',
      state: 'AAAAAAA',
      startDate: currentDate,
      endDate: currentDate,
      workSummary: 'AAAAAAA',
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

    it('should create a WorkDetails', () => {
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

      service.create(new WorkDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a WorkDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jobTitle: 'BBBBBB',
          position: 'BBBBBB',
          companyName: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
          workSummary: 'BBBBBB',
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

    it('should partial update a WorkDetails', () => {
      const patchObject = Object.assign(
        {
          jobTitle: 'BBBBBB',
          position: 'BBBBBB',
          companyName: 'BBBBBB',
          city: 'BBBBBB',
          startDate: currentDate.format(DATE_FORMAT),
        },
        new WorkDetails()
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

    it('should return a list of WorkDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jobTitle: 'BBBBBB',
          position: 'BBBBBB',
          companyName: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
          workSummary: 'BBBBBB',
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

    it('should delete a WorkDetails', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addWorkDetailsToCollectionIfMissing', () => {
      it('should add a WorkDetails to an empty array', () => {
        const workDetails: IWorkDetails = { id: 123 };
        expectedResult = service.addWorkDetailsToCollectionIfMissing([], workDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workDetails);
      });

      it('should not add a WorkDetails to an array that contains it', () => {
        const workDetails: IWorkDetails = { id: 123 };
        const workDetailsCollection: IWorkDetails[] = [
          {
            ...workDetails,
          },
          { id: 456 },
        ];
        expectedResult = service.addWorkDetailsToCollectionIfMissing(workDetailsCollection, workDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a WorkDetails to an array that doesn't contain it", () => {
        const workDetails: IWorkDetails = { id: 123 };
        const workDetailsCollection: IWorkDetails[] = [{ id: 456 }];
        expectedResult = service.addWorkDetailsToCollectionIfMissing(workDetailsCollection, workDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workDetails);
      });

      it('should add only unique WorkDetails to an array', () => {
        const workDetailsArray: IWorkDetails[] = [{ id: 123 }, { id: 456 }, { id: 98631 }];
        const workDetailsCollection: IWorkDetails[] = [{ id: 123 }];
        expectedResult = service.addWorkDetailsToCollectionIfMissing(workDetailsCollection, ...workDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const workDetails: IWorkDetails = { id: 123 };
        const workDetails2: IWorkDetails = { id: 456 };
        expectedResult = service.addWorkDetailsToCollectionIfMissing([], workDetails, workDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workDetails);
        expect(expectedResult).toContain(workDetails2);
      });

      it('should accept null and undefined values', () => {
        const workDetails: IWorkDetails = { id: 123 };
        expectedResult = service.addWorkDetailsToCollectionIfMissing([], null, workDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workDetails);
      });

      it('should return initial array if no WorkDetails is added', () => {
        const workDetailsCollection: IWorkDetails[] = [{ id: 123 }];
        expectedResult = service.addWorkDetailsToCollectionIfMissing(workDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(workDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
