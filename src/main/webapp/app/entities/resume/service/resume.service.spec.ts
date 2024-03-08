import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IResume, Resume } from '../resume.model';

import { ResumeService } from './resume.service';

describe('Resume Service', () => {
  let service: ResumeService;
  let httpMock: HttpTestingController;
  let elemDefault: IResume;
  let expectedResult: IResume | IResume[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ResumeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      resumeSummary: 'AAAAAAA',
      jobTitle: 'AAAAAAA',
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

    it('should create a Resume', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Resume()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Resume', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          resumeSummary: 'BBBBBB',
          jobTitle: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Resume', () => {
      const patchObject = Object.assign(
        {
          resumeSummary: 'BBBBBB',
        },
        new Resume()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Resume', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          resumeSummary: 'BBBBBB',
          jobTitle: 'BBBBBB',
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

    it('should delete a Resume', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addResumeToCollectionIfMissing', () => {
      it('should add a Resume to an empty array', () => {
        const resume: IResume = { id: 123 };
        expectedResult = service.addResumeToCollectionIfMissing([], resume);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resume);
      });

      it('should not add a Resume to an array that contains it', () => {
        const resume: IResume = { id: 123 };
        const resumeCollection: IResume[] = [
          {
            ...resume,
          },
          { id: 456 },
        ];
        expectedResult = service.addResumeToCollectionIfMissing(resumeCollection, resume);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Resume to an array that doesn't contain it", () => {
        const resume: IResume = { id: 123 };
        const resumeCollection: IResume[] = [{ id: 456 }];
        expectedResult = service.addResumeToCollectionIfMissing(resumeCollection, resume);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resume);
      });

      it('should add only unique Resume to an array', () => {
        const resumeArray: IResume[] = [{ id: 123 }, { id: 456 }, { id: 39963 }];
        const resumeCollection: IResume[] = [{ id: 123 }];
        expectedResult = service.addResumeToCollectionIfMissing(resumeCollection, ...resumeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const resume: IResume = { id: 123 };
        const resume2: IResume = { id: 456 };
        expectedResult = service.addResumeToCollectionIfMissing([], resume, resume2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resume);
        expect(expectedResult).toContain(resume2);
      });

      it('should accept null and undefined values', () => {
        const resume: IResume = { id: 123 };
        expectedResult = service.addResumeToCollectionIfMissing([], null, resume, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resume);
      });

      it('should return initial array if no Resume is added', () => {
        const resumeCollection: IResume[] = [{ id: 123 }];
        expectedResult = service.addResumeToCollectionIfMissing(resumeCollection, undefined, null);
        expect(expectedResult).toEqual(resumeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
