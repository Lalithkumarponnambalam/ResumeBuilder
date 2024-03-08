import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISocialLinks, SocialLinks } from '../social-links.model';
import { SocialLinksService } from '../service/social-links.service';

import { SocialLinksRoutingResolveService } from './social-links-routing-resolve.service';

describe('SocialLinks routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SocialLinksRoutingResolveService;
  let service: SocialLinksService;
  let resultSocialLinks: ISocialLinks | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(SocialLinksRoutingResolveService);
    service = TestBed.inject(SocialLinksService);
    resultSocialLinks = undefined;
  });

  describe('resolve', () => {
    it('should return ISocialLinks returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSocialLinks = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSocialLinks).toEqual({ id: 123 });
    });

    it('should return new ISocialLinks if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSocialLinks = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSocialLinks).toEqual(new SocialLinks());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SocialLinks })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSocialLinks = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSocialLinks).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
