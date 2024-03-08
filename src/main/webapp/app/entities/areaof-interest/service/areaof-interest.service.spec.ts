import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAreaofInterest, AreaofInterest } from '../areaof-interest.model';

import { AreaofInterestService } from './areaof-interest.service';

describe('AreaofInterest Service', () => {
  let service: AreaofInterestService;
  let httpMock: HttpTestingController;
  let elemDefault: IAreaofInterest;
  let expectedResult: IAreaofInterest | IAreaofInterest[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AreaofInterestService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      intrestSummary: 'AAAAAAA',
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

    it('should create a AreaofInterest', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AreaofInterest()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AreaofInterest', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          intrestSummary: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AreaofInterest', () => {
      const patchObject = Object.assign({}, new AreaofInterest());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AreaofInterest', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          intrestSummary: 'BBBBBB',
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

    it('should delete a AreaofInterest', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAreaofInterestToCollectionIfMissing', () => {
      it('should add a AreaofInterest to an empty array', () => {
        const areaofInterest: IAreaofInterest = { id: 123 };
        expectedResult = service.addAreaofInterestToCollectionIfMissing([], areaofInterest);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(areaofInterest);
      });

      it('should not add a AreaofInterest to an array that contains it', () => {
        const areaofInterest: IAreaofInterest = { id: 123 };
        const areaofInterestCollection: IAreaofInterest[] = [
          {
            ...areaofInterest,
          },
          { id: 456 },
        ];
        expectedResult = service.addAreaofInterestToCollectionIfMissing(areaofInterestCollection, areaofInterest);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AreaofInterest to an array that doesn't contain it", () => {
        const areaofInterest: IAreaofInterest = { id: 123 };
        const areaofInterestCollection: IAreaofInterest[] = [{ id: 456 }];
        expectedResult = service.addAreaofInterestToCollectionIfMissing(areaofInterestCollection, areaofInterest);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(areaofInterest);
      });

      it('should add only unique AreaofInterest to an array', () => {
        const areaofInterestArray: IAreaofInterest[] = [{ id: 123 }, { id: 456 }, { id: 69232 }];
        const areaofInterestCollection: IAreaofInterest[] = [{ id: 123 }];
        expectedResult = service.addAreaofInterestToCollectionIfMissing(areaofInterestCollection, ...areaofInterestArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const areaofInterest: IAreaofInterest = { id: 123 };
        const areaofInterest2: IAreaofInterest = { id: 456 };
        expectedResult = service.addAreaofInterestToCollectionIfMissing([], areaofInterest, areaofInterest2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(areaofInterest);
        expect(expectedResult).toContain(areaofInterest2);
      });

      it('should accept null and undefined values', () => {
        const areaofInterest: IAreaofInterest = { id: 123 };
        expectedResult = service.addAreaofInterestToCollectionIfMissing([], null, areaofInterest, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(areaofInterest);
      });

      it('should return initial array if no AreaofInterest is added', () => {
        const areaofInterestCollection: IAreaofInterest[] = [{ id: 123 }];
        expectedResult = service.addAreaofInterestToCollectionIfMissing(areaofInterestCollection, undefined, null);
        expect(expectedResult).toEqual(areaofInterestCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
