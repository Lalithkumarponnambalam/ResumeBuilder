import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEducationDetails, EducationDetails } from '../education-details.model';

import { EducationDetailsService } from './education-details.service';

describe('EducationDetails Service', () => {
  let service: EducationDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: IEducationDetails;
  let expectedResult: IEducationDetails | IEducationDetails[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EducationDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      schoolName: 'AAAAAAA',
      city: 'AAAAAAA',
      state: 'AAAAAAA',
      startDate: currentDate,
      endDate: currentDate,
      degree: 'AAAAAAA',
      fieldofStudy: 'AAAAAAA',
      graduationDate: currentDate,
      educationSummary: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
          graduationDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a EducationDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
          graduationDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
          graduationDate: currentDate,
        },
        returnedFromService
      );

      service.create(new EducationDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EducationDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          schoolName: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
          degree: 'BBBBBB',
          fieldofStudy: 'BBBBBB',
          graduationDate: currentDate.format(DATE_FORMAT),
          educationSummary: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
          graduationDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EducationDetails', () => {
      const patchObject = Object.assign(
        {
          schoolName: 'BBBBBB',
          city: 'BBBBBB',
          startDate: currentDate.format(DATE_FORMAT),
          fieldofStudy: 'BBBBBB',
          graduationDate: currentDate.format(DATE_FORMAT),
        },
        new EducationDetails()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
          graduationDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EducationDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          schoolName: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          startDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
          degree: 'BBBBBB',
          fieldofStudy: 'BBBBBB',
          graduationDate: currentDate.format(DATE_FORMAT),
          educationSummary: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
          graduationDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a EducationDetails', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEducationDetailsToCollectionIfMissing', () => {
      it('should add a EducationDetails to an empty array', () => {
        const educationDetails: IEducationDetails = { id: 123 };
        expectedResult = service.addEducationDetailsToCollectionIfMissing([], educationDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(educationDetails);
      });

      it('should not add a EducationDetails to an array that contains it', () => {
        const educationDetails: IEducationDetails = { id: 123 };
        const educationDetailsCollection: IEducationDetails[] = [
          {
            ...educationDetails,
          },
          { id: 456 },
        ];
        expectedResult = service.addEducationDetailsToCollectionIfMissing(educationDetailsCollection, educationDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EducationDetails to an array that doesn't contain it", () => {
        const educationDetails: IEducationDetails = { id: 123 };
        const educationDetailsCollection: IEducationDetails[] = [{ id: 456 }];
        expectedResult = service.addEducationDetailsToCollectionIfMissing(educationDetailsCollection, educationDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(educationDetails);
      });

      it('should add only unique EducationDetails to an array', () => {
        const educationDetailsArray: IEducationDetails[] = [{ id: 123 }, { id: 456 }, { id: 48304 }];
        const educationDetailsCollection: IEducationDetails[] = [{ id: 123 }];
        expectedResult = service.addEducationDetailsToCollectionIfMissing(educationDetailsCollection, ...educationDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const educationDetails: IEducationDetails = { id: 123 };
        const educationDetails2: IEducationDetails = { id: 456 };
        expectedResult = service.addEducationDetailsToCollectionIfMissing([], educationDetails, educationDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(educationDetails);
        expect(expectedResult).toContain(educationDetails2);
      });

      it('should accept null and undefined values', () => {
        const educationDetails: IEducationDetails = { id: 123 };
        expectedResult = service.addEducationDetailsToCollectionIfMissing([], null, educationDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(educationDetails);
      });

      it('should return initial array if no EducationDetails is added', () => {
        const educationDetailsCollection: IEducationDetails[] = [{ id: 123 }];
        expectedResult = service.addEducationDetailsToCollectionIfMissing(educationDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(educationDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
