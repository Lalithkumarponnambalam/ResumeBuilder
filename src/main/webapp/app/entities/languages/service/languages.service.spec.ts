import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LangOptions } from 'app/entities/enumerations/lang-options.model';
import { ILanguages, Languages } from '../languages.model';

import { LanguagesService } from './languages.service';

describe('Languages Service', () => {
  let service: LanguagesService;
  let httpMock: HttpTestingController;
  let elemDefault: ILanguages;
  let expectedResult: ILanguages | ILanguages[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LanguagesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      langOption: LangOptions.English,
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

    it('should create a Languages', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Languages()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Languages', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          langOption: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Languages', () => {
      const patchObject = Object.assign({}, new Languages());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Languages', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          langOption: 'BBBBBB',
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

    it('should delete a Languages', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLanguagesToCollectionIfMissing', () => {
      it('should add a Languages to an empty array', () => {
        const languages: ILanguages = { id: 123 };
        expectedResult = service.addLanguagesToCollectionIfMissing([], languages);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(languages);
      });

      it('should not add a Languages to an array that contains it', () => {
        const languages: ILanguages = { id: 123 };
        const languagesCollection: ILanguages[] = [
          {
            ...languages,
          },
          { id: 456 },
        ];
        expectedResult = service.addLanguagesToCollectionIfMissing(languagesCollection, languages);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Languages to an array that doesn't contain it", () => {
        const languages: ILanguages = { id: 123 };
        const languagesCollection: ILanguages[] = [{ id: 456 }];
        expectedResult = service.addLanguagesToCollectionIfMissing(languagesCollection, languages);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(languages);
      });

      it('should add only unique Languages to an array', () => {
        const languagesArray: ILanguages[] = [{ id: 123 }, { id: 456 }, { id: 37360 }];
        const languagesCollection: ILanguages[] = [{ id: 123 }];
        expectedResult = service.addLanguagesToCollectionIfMissing(languagesCollection, ...languagesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const languages: ILanguages = { id: 123 };
        const languages2: ILanguages = { id: 456 };
        expectedResult = service.addLanguagesToCollectionIfMissing([], languages, languages2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(languages);
        expect(expectedResult).toContain(languages2);
      });

      it('should accept null and undefined values', () => {
        const languages: ILanguages = { id: 123 };
        expectedResult = service.addLanguagesToCollectionIfMissing([], null, languages, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(languages);
      });

      it('should return initial array if no Languages is added', () => {
        const languagesCollection: ILanguages[] = [{ id: 123 }];
        expectedResult = service.addLanguagesToCollectionIfMissing(languagesCollection, undefined, null);
        expect(expectedResult).toEqual(languagesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
