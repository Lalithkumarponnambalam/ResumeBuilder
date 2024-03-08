import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPersonalDetails, PersonalDetails } from '../personal-details.model';

import { PersonalDetailsService } from './personal-details.service';

describe('PersonalDetails Service', () => {
  let service: PersonalDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: IPersonalDetails;
  let expectedResult: IPersonalDetails | IPersonalDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PersonalDetailsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      profilePhotoContentType: 'image/png',
      profilePhoto: 'AAAAAAA',
      firstName: 'AAAAAAA',
      lastName: 'AAAAAAA',
      email: 'AAAAAAA',
      phone: 'AAAAAAA',
      address: 'AAAAAAA',
      city: 'AAAAAAA',
      state: 'AAAAAAA',
      zipCode: 'AAAAAAA',
      country: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PersonalDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PersonalDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PersonalDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          profilePhoto: 'BBBBBB',
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
          address: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          zipCode: 'BBBBBB',
          country: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PersonalDetails', () => {
      const patchObject = Object.assign(
        {
          profilePhoto: 'BBBBBB',
          lastName: 'BBBBBB',
        },
        new PersonalDetails()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PersonalDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          profilePhoto: 'BBBBBB',
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
          address: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          zipCode: 'BBBBBB',
          country: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PersonalDetails', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPersonalDetailsToCollectionIfMissing', () => {
      it('should add a PersonalDetails to an empty array', () => {
        const personalDetails: IPersonalDetails = { id: 123 };
        expectedResult = service.addPersonalDetailsToCollectionIfMissing([], personalDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(personalDetails);
      });

      it('should not add a PersonalDetails to an array that contains it', () => {
        const personalDetails: IPersonalDetails = { id: 123 };
        const personalDetailsCollection: IPersonalDetails[] = [
          {
            ...personalDetails,
          },
          { id: 456 },
        ];
        expectedResult = service.addPersonalDetailsToCollectionIfMissing(personalDetailsCollection, personalDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PersonalDetails to an array that doesn't contain it", () => {
        const personalDetails: IPersonalDetails = { id: 123 };
        const personalDetailsCollection: IPersonalDetails[] = [{ id: 456 }];
        expectedResult = service.addPersonalDetailsToCollectionIfMissing(personalDetailsCollection, personalDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(personalDetails);
      });

      it('should add only unique PersonalDetails to an array', () => {
        const personalDetailsArray: IPersonalDetails[] = [{ id: 123 }, { id: 456 }, { id: 74295 }];
        const personalDetailsCollection: IPersonalDetails[] = [{ id: 123 }];
        expectedResult = service.addPersonalDetailsToCollectionIfMissing(personalDetailsCollection, ...personalDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const personalDetails: IPersonalDetails = { id: 123 };
        const personalDetails2: IPersonalDetails = { id: 456 };
        expectedResult = service.addPersonalDetailsToCollectionIfMissing([], personalDetails, personalDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(personalDetails);
        expect(expectedResult).toContain(personalDetails2);
      });

      it('should accept null and undefined values', () => {
        const personalDetails: IPersonalDetails = { id: 123 };
        expectedResult = service.addPersonalDetailsToCollectionIfMissing([], null, personalDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(personalDetails);
      });

      it('should return initial array if no PersonalDetails is added', () => {
        const personalDetailsCollection: IPersonalDetails[] = [{ id: 123 }];
        expectedResult = service.addPersonalDetailsToCollectionIfMissing(personalDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(personalDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
