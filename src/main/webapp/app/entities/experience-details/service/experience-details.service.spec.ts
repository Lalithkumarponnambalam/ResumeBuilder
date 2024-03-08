import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IExperienceDetails, ExperienceDetails } from '../experience-details.model';

import { ExperienceDetailsService } from './experience-details.service';

describe('ExperienceDetails Service', () => {
  let service: ExperienceDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: IExperienceDetails;
  let expectedResult: IExperienceDetails | IExperienceDetails[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExperienceDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      positionTitle: 'AAAAAAA',
      companyName: 'AAAAAAA',
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

    it('should create a ExperienceDetails', () => {
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

      service.create(new ExperienceDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExperienceDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          positionTitle: 'BBBBBB',
          companyName: 'BBBBBB',
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

    it('should partial update a ExperienceDetails', () => {
      const patchObject = Object.assign(
        {
          companyName: 'BBBBBB',
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
          workSummary: 'BBBBBB',
        },
        new ExperienceDetails()
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

    it('should return a list of ExperienceDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          positionTitle: 'BBBBBB',
          companyName: 'BBBBBB',
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

    it('should delete a ExperienceDetails', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addExperienceDetailsToCollectionIfMissing', () => {
      it('should add a ExperienceDetails to an empty array', () => {
        const experienceDetails: IExperienceDetails = { id: 123 };
        expectedResult = service.addExperienceDetailsToCollectionIfMissing([], experienceDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(experienceDetails);
      });

      it('should not add a ExperienceDetails to an array that contains it', () => {
        const experienceDetails: IExperienceDetails = { id: 123 };
        const experienceDetailsCollection: IExperienceDetails[] = [
          {
            ...experienceDetails,
          },
          { id: 456 },
        ];
        expectedResult = service.addExperienceDetailsToCollectionIfMissing(experienceDetailsCollection, experienceDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExperienceDetails to an array that doesn't contain it", () => {
        const experienceDetails: IExperienceDetails = { id: 123 };
        const experienceDetailsCollection: IExperienceDetails[] = [{ id: 456 }];
        expectedResult = service.addExperienceDetailsToCollectionIfMissing(experienceDetailsCollection, experienceDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(experienceDetails);
      });

      it('should add only unique ExperienceDetails to an array', () => {
        const experienceDetailsArray: IExperienceDetails[] = [{ id: 123 }, { id: 456 }, { id: 1919 }];
        const experienceDetailsCollection: IExperienceDetails[] = [{ id: 123 }];
        expectedResult = service.addExperienceDetailsToCollectionIfMissing(experienceDetailsCollection, ...experienceDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const experienceDetails: IExperienceDetails = { id: 123 };
        const experienceDetails2: IExperienceDetails = { id: 456 };
        expectedResult = service.addExperienceDetailsToCollectionIfMissing([], experienceDetails, experienceDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(experienceDetails);
        expect(expectedResult).toContain(experienceDetails2);
      });

      it('should accept null and undefined values', () => {
        const experienceDetails: IExperienceDetails = { id: 123 };
        expectedResult = service.addExperienceDetailsToCollectionIfMissing([], null, experienceDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(experienceDetails);
      });

      it('should return initial array if no ExperienceDetails is added', () => {
        const experienceDetailsCollection: IExperienceDetails[] = [{ id: 123 }];
        expectedResult = service.addExperienceDetailsToCollectionIfMissing(experienceDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(experienceDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
