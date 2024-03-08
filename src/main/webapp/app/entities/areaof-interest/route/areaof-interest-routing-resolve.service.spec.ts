import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAreaofInterest, AreaofInterest } from '../areaof-interest.model';
import { AreaofInterestService } from '../service/areaof-interest.service';

import { AreaofInterestRoutingResolveService } from './areaof-interest-routing-resolve.service';

describe('AreaofInterest routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AreaofInterestRoutingResolveService;
  let service: AreaofInterestService;
  let resultAreaofInterest: IAreaofInterest | undefined;

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
    routingResolveService = TestBed.inject(AreaofInterestRoutingResolveService);
    service = TestBed.inject(AreaofInterestService);
    resultAreaofInterest = undefined;
  });

  describe('resolve', () => {
    it('should return IAreaofInterest returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAreaofInterest = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAreaofInterest).toEqual({ id: 123 });
    });

    it('should return new IAreaofInterest if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAreaofInterest = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAreaofInterest).toEqual(new AreaofInterest());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AreaofInterest })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAreaofInterest = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAreaofInterest).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
