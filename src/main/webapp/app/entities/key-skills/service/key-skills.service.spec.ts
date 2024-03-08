import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IKeySkills, KeySkills } from '../key-skills.model';

import { KeySkillsService } from './key-skills.service';

describe('KeySkills Service', () => {
  let service: KeySkillsService;
  let httpMock: HttpTestingController;
  let elemDefault: IKeySkills;
  let expectedResult: IKeySkills | IKeySkills[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KeySkillsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      keySkillsSummary: 'AAAAAAA',
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

    it('should create a KeySkills', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new KeySkills()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a KeySkills', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          keySkillsSummary: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a KeySkills', () => {
      const patchObject = Object.assign({}, new KeySkills());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of KeySkills', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          keySkillsSummary: 'BBBBBB',
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

    it('should delete a KeySkills', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addKeySkillsToCollectionIfMissing', () => {
      it('should add a KeySkills to an empty array', () => {
        const keySkills: IKeySkills = { id: 123 };
        expectedResult = service.addKeySkillsToCollectionIfMissing([], keySkills);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(keySkills);
      });

      it('should not add a KeySkills to an array that contains it', () => {
        const keySkills: IKeySkills = { id: 123 };
        const keySkillsCollection: IKeySkills[] = [
          {
            ...keySkills,
          },
          { id: 456 },
        ];
        expectedResult = service.addKeySkillsToCollectionIfMissing(keySkillsCollection, keySkills);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a KeySkills to an array that doesn't contain it", () => {
        const keySkills: IKeySkills = { id: 123 };
        const keySkillsCollection: IKeySkills[] = [{ id: 456 }];
        expectedResult = service.addKeySkillsToCollectionIfMissing(keySkillsCollection, keySkills);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(keySkills);
      });

      it('should add only unique KeySkills to an array', () => {
        const keySkillsArray: IKeySkills[] = [{ id: 123 }, { id: 456 }, { id: 92353 }];
        const keySkillsCollection: IKeySkills[] = [{ id: 123 }];
        expectedResult = service.addKeySkillsToCollectionIfMissing(keySkillsCollection, ...keySkillsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const keySkills: IKeySkills = { id: 123 };
        const keySkills2: IKeySkills = { id: 456 };
        expectedResult = service.addKeySkillsToCollectionIfMissing([], keySkills, keySkills2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(keySkills);
        expect(expectedResult).toContain(keySkills2);
      });

      it('should accept null and undefined values', () => {
        const keySkills: IKeySkills = { id: 123 };
        expectedResult = service.addKeySkillsToCollectionIfMissing([], null, keySkills, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(keySkills);
      });

      it('should return initial array if no KeySkills is added', () => {
        const keySkillsCollection: IKeySkills[] = [{ id: 123 }];
        expectedResult = service.addKeySkillsToCollectionIfMissing(keySkillsCollection, undefined, null);
        expect(expectedResult).toEqual(keySkillsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
