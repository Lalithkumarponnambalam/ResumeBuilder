import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISocialLinks, SocialLinks } from '../social-links.model';

import { SocialLinksService } from './social-links.service';

describe('SocialLinks Service', () => {
  let service: SocialLinksService;
  let httpMock: HttpTestingController;
  let elemDefault: ISocialLinks;
  let expectedResult: ISocialLinks | ISocialLinks[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SocialLinksService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      lable: 'AAAAAAA',
      link: 'AAAAAAA',
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

    it('should create a SocialLinks', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SocialLinks()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SocialLinks', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          lable: 'BBBBBB',
          link: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SocialLinks', () => {
      const patchObject = Object.assign(
        {
          link: 'BBBBBB',
        },
        new SocialLinks()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SocialLinks', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          lable: 'BBBBBB',
          link: 'BBBBBB',
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

    it('should delete a SocialLinks', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSocialLinksToCollectionIfMissing', () => {
      it('should add a SocialLinks to an empty array', () => {
        const socialLinks: ISocialLinks = { id: 123 };
        expectedResult = service.addSocialLinksToCollectionIfMissing([], socialLinks);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(socialLinks);
      });

      it('should not add a SocialLinks to an array that contains it', () => {
        const socialLinks: ISocialLinks = { id: 123 };
        const socialLinksCollection: ISocialLinks[] = [
          {
            ...socialLinks,
          },
          { id: 456 },
        ];
        expectedResult = service.addSocialLinksToCollectionIfMissing(socialLinksCollection, socialLinks);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SocialLinks to an array that doesn't contain it", () => {
        const socialLinks: ISocialLinks = { id: 123 };
        const socialLinksCollection: ISocialLinks[] = [{ id: 456 }];
        expectedResult = service.addSocialLinksToCollectionIfMissing(socialLinksCollection, socialLinks);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(socialLinks);
      });

      it('should add only unique SocialLinks to an array', () => {
        const socialLinksArray: ISocialLinks[] = [{ id: 123 }, { id: 456 }, { id: 18687 }];
        const socialLinksCollection: ISocialLinks[] = [{ id: 123 }];
        expectedResult = service.addSocialLinksToCollectionIfMissing(socialLinksCollection, ...socialLinksArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const socialLinks: ISocialLinks = { id: 123 };
        const socialLinks2: ISocialLinks = { id: 456 };
        expectedResult = service.addSocialLinksToCollectionIfMissing([], socialLinks, socialLinks2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(socialLinks);
        expect(expectedResult).toContain(socialLinks2);
      });

      it('should accept null and undefined values', () => {
        const socialLinks: ISocialLinks = { id: 123 };
        expectedResult = service.addSocialLinksToCollectionIfMissing([], null, socialLinks, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(socialLinks);
      });

      it('should return initial array if no SocialLinks is added', () => {
        const socialLinksCollection: ISocialLinks[] = [{ id: 123 }];
        expectedResult = service.addSocialLinksToCollectionIfMissing(socialLinksCollection, undefined, null);
        expect(expectedResult).toEqual(socialLinksCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
